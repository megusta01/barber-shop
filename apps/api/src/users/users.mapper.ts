import type { BarberDto, UserDto } from '@barbearia/shared'
import type { Types } from 'mongoose'

import type { User } from './user.schema'

type UserLike = User & { _id: Types.ObjectId }

export const toUserDto = (user: UserLike): UserDto => ({
  id: user._id.toString(),
  email: user.email,
  displayName: user.displayName,
  avatarUrl: user.avatarUrl ?? '',
  phone: user.phone ?? '',
  description: user.description ?? '',
  role: user.role,
  // documentos antigos podem não ter o campo
  isActive: user.isActive !== false,
  isFirstLogin: Boolean(user.isFirstLogin),
  createdAt: new Date(user.createdAt).toISOString(),
})

export const toBarberDto = (user: UserLike): BarberDto => ({
  id: user._id.toString(),
  displayName: user.displayName,
  avatarUrl: user.avatarUrl ?? '',
  description: user.description ?? '',
})
