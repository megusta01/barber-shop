import { AvailabilityDto, ErrorCode, Role } from '@barbearia/shared'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { AppointmentsService } from '../appointments/appointments.service'
import type { AuthUser } from '../common/types'
import { User } from '../users/user.schema'
import { BarberSchedule } from './barber-schedule.schema'

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(BarberSchedule.name) private readonly schedules: Model<BarberSchedule>,
    @InjectModel(User.name) private readonly users: Model<User>,
    private readonly appointments: AppointmentsService,
  ) {}

  async get(barberId: string, includePast = false): Promise<AvailabilityDto> {
    await this.assertBarberExists(barberId)

    const schedule = await this.schedules.findOne({ barber: barberId }).lean().exec()
    const now = Date.now()
    const dates = (schedule?.availability ?? [])
      .map((d) => new Date(d))
      .filter((d) => includePast || d.getTime() > now)
      .sort((a, b) => a.getTime() - b.getTime())

    const booked = await this.appointments.findBookedDates(barberId, dates)

    return {
      barberId,
      slots: dates.map((d) => ({ date: d.toISOString(), booked: booked.has(d.toISOString()) })),
    }
  }

  async addSlots(actor: AuthUser, barberId: string, slots: Date[]): Promise<AvailabilityDto> {
    this.assertCanManage(actor, barberId)
    await this.assertBarberExists(barberId)

    if (slots.some((d) => d.getTime() <= Date.now())) {
      throw new BadRequestException(ErrorCode.SLOT_IN_PAST)
    }

    await this.schedules
      .updateOne(
        { barber: barberId },
        { $addToSet: { availability: { $each: slots } } },
        { upsert: true },
      )
      .exec()

    return this.get(barberId)
  }

  async removeSlots(actor: AuthUser, barberId: string, slots: Date[]): Promise<AvailabilityDto> {
    this.assertCanManage(actor, barberId)
    await this.assertBarberExists(barberId)

    const booked = await this.appointments.findBookedDates(barberId, slots)
    if (booked.size > 0) throw new ConflictException(ErrorCode.SLOT_HAS_APPOINTMENT)

    await this.schedules
      .updateOne({ barber: barberId }, { $pull: { availability: { $in: slots } } })
      .exec()

    return this.get(barberId)
  }

  private assertCanManage(actor: AuthUser, barberId: string): void {
    if (actor.role !== Role.ADMIN && actor.sub !== barberId) {
      throw new ForbiddenException(ErrorCode.FORBIDDEN)
    }
  }

  private async assertBarberExists(barberId: string): Promise<void> {
    const exists = await this.users.exists({ _id: barberId, role: Role.BARBER })
    if (!exists) throw new NotFoundException(ErrorCode.BARBER_NOT_FOUND)
  }
}
