export const AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export type AppointmentStatus = (typeof AppointmentStatus)[keyof typeof AppointmentStatus]

export const APPOINTMENT_STATUSES: readonly AppointmentStatus[] = Object.values(AppointmentStatus)

/** Status que ocupam o horário do barbeiro. */
export const ACTIVE_APPOINTMENT_STATUSES: readonly AppointmentStatus[] = [
  AppointmentStatus.PENDING,
  AppointmentStatus.CONFIRMED,
]

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}

export const ServiceType = {
  HAIRCUT: 'haircut',
  SHAVE: 'shave',
  HAIRCUT_AND_SHAVE: 'haircut and shave',
  BEARD_TRIM: 'beard trim',
} as const

export type ServiceType = (typeof ServiceType)[keyof typeof ServiceType]

export const SERVICE_TYPES: readonly ServiceType[] = Object.values(ServiceType)

export const SERVICE_LABELS: Record<ServiceType, string> = {
  haircut: 'Corte',
  shave: 'Barba',
  'haircut and shave': 'Corte e barba',
  'beard trim': 'Aparar barba',
}
