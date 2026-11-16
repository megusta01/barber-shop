import type { AppointmentStatus, ServiceType } from './appointments'
import type { Role } from './roles'

/** Conteúdo do access token (JWT). */
export interface JwtPayload {
  sub: string
  email: string
  role: Role
  name: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface UserDto {
  id: string
  email: string
  displayName: string
  avatarUrl: string
  phone: string
  description: string
  role: Role
  isActive: boolean
  isFirstLogin: boolean
  createdAt: string
}

export interface BarberDto {
  id: string
  displayName: string
  avatarUrl: string
  description: string
}

export interface PersonRef {
  id: string
  displayName: string
}

export interface AppointmentDto {
  id: string
  date: string
  service: ServiceType
  status: AppointmentStatus
  isPaid: boolean
  customer: PersonRef
  barber: PersonRef
  createdAt: string
}

export interface AvailabilitySlot {
  date: string
  booked: boolean
}

export interface AvailabilityDto {
  barberId: string
  slots: AvailabilitySlot[]
}

/** Códigos de erro devolvidos no campo `message` das respostas 4xx. */
export const ErrorCode = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_INACTIVE: 'USER_INACTIVE',
  BARBER_NOT_FOUND: 'BARBER_NOT_FOUND',
  APPOINTMENT_NOT_FOUND: 'APPOINTMENT_NOT_FOUND',
  SLOT_UNAVAILABLE: 'SLOT_UNAVAILABLE',
  SLOT_ALREADY_BOOKED: 'SLOT_ALREADY_BOOKED',
  SLOT_IN_PAST: 'SLOT_IN_PAST',
  SLOT_HAS_APPOINTMENT: 'SLOT_HAS_APPOINTMENT',
  STATUS_TRANSITION_NOT_ALLOWED: 'STATUS_TRANSITION_NOT_ALLOWED',
  CANNOT_CHANGE_OWN_ROLE: 'CANNOT_CHANGE_OWN_ROLE',
  CANNOT_DELETE_SELF: 'CANNOT_DELETE_SELF',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVALID_ID: 'INVALID_ID',
} as const

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
