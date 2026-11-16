import type {
  AppointmentDto,
  AppointmentStatus,
  AuthTokens,
  AvailabilityDto,
  BarberDto,
  Paginated,
  Role,
  ServiceType,
  UserDto,
} from '@barbearia/shared'

import { API_URL } from '../env'
import { http } from './http'

export const authApi = {
  /** URL que inicia o login com Google (navegação completa, não XHR). */
  googleLoginUrl: `${API_URL}/auth/google`,

  refresh: (refreshToken: string) =>
    http.post<AuthTokens>('/auth/refresh', { refreshToken }).then((r) => r.data),
}

export interface ProfileInput {
  displayName?: string
  phone?: string
  description?: string
}

export interface ListUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: Role
}

export const usersApi = {
  me: () => http.get<UserDto>('/users/me').then((r) => r.data),

  updateMe: (input: ProfileInput) => http.patch<UserDto>('/users/me', input).then((r) => r.data),

  list: (params: ListUsersParams) =>
    http.get<Paginated<UserDto>>('/users', { params }).then((r) => r.data),

  update: (id: string, input: ProfileInput & { isActive?: boolean }) =>
    http.patch<UserDto>(`/users/${id}`, input).then((r) => r.data),

  updateRole: (id: string, role: Role) =>
    http.patch<UserDto>(`/users/${id}/role`, { role }).then((r) => r.data),

  remove: (id: string) => http.delete<void>(`/users/${id}`),
}

export const barbersApi = {
  list: () => http.get<BarberDto[]>('/barbers').then((r) => r.data),
}

export const availabilityApi = {
  get: (barberId: string) =>
    http.get<AvailabilityDto>(`/barbers/${barberId}/availability`).then((r) => r.data),

  add: (barberId: string, slots: string[]) =>
    http.post<AvailabilityDto>(`/barbers/${barberId}/availability`, { slots }).then((r) => r.data),

  remove: (barberId: string, slots: string[]) =>
    http
      .delete<AvailabilityDto>(`/barbers/${barberId}/availability`, { data: { slots } })
      .then((r) => r.data),
}

export interface ListAppointmentsParams {
  page?: number
  limit?: number
  from?: string
  to?: string
  status?: AppointmentStatus
  order?: 'asc' | 'desc'
}

export const appointmentsApi = {
  list: (params: ListAppointmentsParams) =>
    http.get<Paginated<AppointmentDto>>('/appointments', { params }).then((r) => r.data),

  create: (input: { barberId: string; date: string; service: ServiceType }) =>
    http.post<AppointmentDto>('/appointments', input).then((r) => r.data),

  update: (id: string, input: { status?: AppointmentStatus; isPaid?: boolean }) =>
    http.patch<AppointmentDto>(`/appointments/${id}`, input).then((r) => r.data),
}
