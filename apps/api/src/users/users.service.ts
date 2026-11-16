import { BarberDto, ErrorCode, Paginated, Role, UserDto } from '@barbearia/shared'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'

import { Appointment } from '../appointments/appointment.schema'
import { BarberSchedule } from '../availability/barber-schedule.schema'
import { escapeRegex } from '../common/utils/escape-regex'
import { AdminUpdateUserDto } from './dto/admin-update-user.dto'
import { ListUsersQueryDto } from './dto/list-users-query.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { User, UserDocument } from './user.schema'
import { toBarberDto, toUserDto } from './users.mapper'

export interface GoogleProfileData {
  googleId: string
  email: string
  displayName: string
  avatarUrl: string
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Appointment.name) private readonly appointments: Model<Appointment>,
    @InjectModel(BarberSchedule.name) private readonly schedules: Model<BarberSchedule>,
  ) {}

  /** Busca o usuário pelo Google ID ou cria um novo cliente. */
  async findOrCreateFromGoogle(profile: GoogleProfileData): Promise<UserDocument> {
    const existing = await this.users.findOne({ googleId: profile.googleId }).exec()
    if (existing) return existing

    return this.users.create({ ...profile, role: Role.CLIENT, isFirstLogin: true })
  }

  async findDocumentById(id: string): Promise<UserDocument | null> {
    return this.users.findById(id).exec()
  }

  async getById(id: string): Promise<UserDto> {
    const user = await this.users.findById(id).lean().exec()
    if (!user) throw new NotFoundException(ErrorCode.USER_NOT_FOUND)
    return toUserDto(user)
  }

  async list(query: ListUsersQueryDto): Promise<Paginated<UserDto>> {
    const filter: FilterQuery<User> = {}
    if (query.role) filter.role = query.role
    if (query.search) {
      const term = new RegExp(escapeRegex(query.search.trim()), 'i')
      filter.$or = [{ displayName: term }, { email: term }]
    }

    const [items, total] = await Promise.all([
      this.users
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(query.skip)
        .limit(query.limit)
        .lean()
        .exec(),
      this.users.countDocuments(filter).exec(),
    ])

    return { items: items.map(toUserDto), total, page: query.page, limit: query.limit }
  }

  /** Barbeiros ativos, com dados públicos apenas. */
  async listBarbers(): Promise<BarberDto[]> {
    const barbers = await this.users
      .find({ role: Role.BARBER, isActive: { $ne: false } })
      .sort({ displayName: 1 })
      .lean()
      .exec()
    return barbers.map(toBarberDto)
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<UserDto> {
    return this.applyUpdate(id, { ...dto, isFirstLogin: false })
  }

  async adminUpdate(id: string, dto: AdminUpdateUserDto): Promise<UserDto> {
    return this.applyUpdate(id, dto)
  }

  async updateRole(id: string, role: Role, actorId: string): Promise<UserDto> {
    if (id === actorId) throw new BadRequestException(ErrorCode.CANNOT_CHANGE_OWN_ROLE)
    return this.applyUpdate(id, { role })
  }

  /** Remove o usuário junto com os agendamentos e a agenda dele. */
  async remove(id: string, actorId: string): Promise<void> {
    if (id === actorId) throw new BadRequestException(ErrorCode.CANNOT_DELETE_SELF)

    const deleted = await this.users.findByIdAndDelete(id).exec()
    if (!deleted) throw new NotFoundException(ErrorCode.USER_NOT_FOUND)

    await Promise.all([
      this.appointments.deleteMany({ $or: [{ barber: id }, { customer: id }] }).exec(),
      this.schedules.deleteOne({ barber: id }).exec(),
    ])
  }

  private async applyUpdate(id: string, changes: Partial<User>): Promise<UserDto> {
    const updated = await this.users
      .findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true })
      .lean()
      .exec()
    if (!updated) throw new NotFoundException(ErrorCode.USER_NOT_FOUND)
    return toUserDto(updated)
  }
}
