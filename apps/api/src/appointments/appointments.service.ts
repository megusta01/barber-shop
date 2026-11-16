import {
  ACTIVE_APPOINTMENT_STATUSES,
  AppointmentDto,
  ErrorCode,
  Paginated,
  Role,
} from '@barbearia/shared'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, UpdateQuery } from 'mongoose'

import { BarberSchedule } from '../availability/barber-schedule.schema'
import type { AuthUser } from '../common/types'
import { sameId } from '../common/utils/same-id'
import { User } from '../users/user.schema'
import { canTransition, occupiesSlot } from './appointment-rules'
import { Appointment, buildSlotKey } from './appointment.schema'
import { PopulatedAppointment, toAppointmentDto } from './appointments.mapper'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto'
import { UpdateAppointmentDto } from './dto/update-appointment.dto'

const PERSON_FIELDS = 'displayName'
const DUPLICATE_KEY = 11000

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private readonly appointments: Model<Appointment>,
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(BarberSchedule.name) private readonly schedules: Model<BarberSchedule>,
  ) {}

  async create(actor: AuthUser, dto: CreateAppointmentDto): Promise<AppointmentDto> {
    const customerId = this.resolveCustomerId(actor, dto.customerId)
    const date = dto.date

    if (date.getTime() <= Date.now()) throw new BadRequestException(ErrorCode.SLOT_IN_PAST)

    const [barber, customer, slotOffered] = await Promise.all([
      this.users.exists({ _id: dto.barberId, role: Role.BARBER, isActive: { $ne: false } }),
      this.users.exists({ _id: customerId, isActive: { $ne: false } }),
      this.schedules.exists({ barber: dto.barberId, availability: date }),
    ])

    if (!barber) throw new NotFoundException(ErrorCode.BARBER_NOT_FOUND)
    if (!customer) throw new NotFoundException(ErrorCode.USER_NOT_FOUND)
    if (!slotOffered) throw new BadRequestException(ErrorCode.SLOT_UNAVAILABLE)

    try {
      const created = await this.appointments.create({
        date,
        service: dto.service,
        barber: dto.barberId,
        customer: customerId,
        slotKey: buildSlotKey(dto.barberId, date),
      })
      return this.getPopulated(created._id.toString())
    } catch (error) {
      if ((error as { code?: number }).code === DUPLICATE_KEY) {
        throw new ConflictException(ErrorCode.SLOT_ALREADY_BOOKED)
      }
      throw error
    }
  }

  async list(actor: AuthUser, query: ListAppointmentsQueryDto): Promise<Paginated<AppointmentDto>> {
    const filter: FilterQuery<Appointment> = {}

    if (actor.role === Role.BARBER) filter.barber = actor.sub
    else if (actor.role === Role.CLIENT) filter.customer = actor.sub
    else {
      if (query.barberId) filter.barber = query.barberId
      if (query.customerId) filter.customer = query.customerId
    }

    if (query.status) filter.status = query.status
    if (query.from || query.to) {
      filter.date = {
        ...(query.from && { $gte: query.from }),
        ...(query.to && { $lt: query.to }),
      }
    }

    const [items, total] = await Promise.all([
      this.appointments
        .find(filter)
        .sort({ date: query.order === 'desc' ? -1 : 1 })
        .skip(query.skip)
        .limit(query.limit)
        .populate('customer', PERSON_FIELDS)
        .populate('barber', PERSON_FIELDS)
        .lean<PopulatedAppointment[]>()
        .exec(),
      this.appointments.countDocuments(filter).exec(),
    ])

    return { items: items.map(toAppointmentDto), total, page: query.page, limit: query.limit }
  }

  async findOne(actor: AuthUser, id: string): Promise<AppointmentDto> {
    const appointment = await this.findAccessible(actor, id)
    return this.getPopulated(appointment._id.toString())
  }

  async update(actor: AuthUser, id: string, dto: UpdateAppointmentDto): Promise<AppointmentDto> {
    const appointment = await this.findAccessible(actor, id)
    const changes: UpdateQuery<Appointment> = {}

    if (dto.isPaid !== undefined) {
      if (actor.role === Role.CLIENT) throw new ForbiddenException(ErrorCode.FORBIDDEN)
      changes.$set = { isPaid: dto.isPaid }
    }

    if (dto.status && dto.status !== appointment.status) {
      if (!canTransition(actor.role, appointment.status, dto.status)) {
        throw new BadRequestException(ErrorCode.STATUS_TRANSITION_NOT_ALLOWED)
      }
      changes.$set = { ...changes.$set, status: dto.status }
      // libera o horário quando o agendamento deixa de ocupá-lo
      if (!occupiesSlot(dto.status)) changes.$unset = { slotKey: 1 }
    }

    if (changes.$set || changes.$unset) {
      await this.appointments.updateOne({ _id: appointment._id }, changes).exec()
    }

    return this.getPopulated(appointment._id.toString())
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.appointments.findByIdAndDelete(id).exec()
    if (!deleted) throw new NotFoundException(ErrorCode.APPOINTMENT_NOT_FOUND)
  }

  /** Datas (dentre as informadas) que já têm agendamento ativo com o barbeiro. */
  async findBookedDates(barberId: string, dates: Date[]): Promise<Set<string>> {
    if (dates.length === 0) return new Set()
    const booked = await this.appointments
      .find({
        barber: barberId,
        date: { $in: dates },
        status: { $in: ACTIVE_APPOINTMENT_STATUSES },
      })
      .select('date')
      .lean()
      .exec()
    return new Set(booked.map((a) => new Date(a.date).toISOString()))
  }

  private resolveCustomerId(actor: AuthUser, requested?: string): string {
    if (!requested || requested === actor.sub) return actor.sub
    if (actor.role !== Role.ADMIN) throw new ForbiddenException(ErrorCode.FORBIDDEN)
    return requested
  }

  /** Busca o agendamento garantindo que o usuário pode vê-lo (404 caso contrário). */
  private async findAccessible(actor: AuthUser, id: string) {
    const appointment = await this.appointments.findById(id).lean().exec()
    const allowed =
      appointment &&
      (actor.role === Role.ADMIN ||
        sameId(appointment.barber, actor.sub) ||
        sameId(appointment.customer, actor.sub))

    if (!appointment || !allowed) throw new NotFoundException(ErrorCode.APPOINTMENT_NOT_FOUND)
    return appointment
  }

  private async getPopulated(id: string): Promise<AppointmentDto> {
    const appointment = await this.appointments
      .findById(id)
      .populate('customer', PERSON_FIELDS)
      .populate('barber', PERSON_FIELDS)
      .lean<PopulatedAppointment>()
      .exec()
    if (!appointment) throw new NotFoundException(ErrorCode.APPOINTMENT_NOT_FOUND)
    return toAppointmentDto(appointment)
  }
}
