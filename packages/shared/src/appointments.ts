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

const { PENDING, CONFIRMED, COMPLETED, CANCELLED } = AppointmentStatus

/** Transições de status permitidas. Concluído e cancelado são finais. */
export const STATUS_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  [PENDING]: [CONFIRMED, COMPLETED, CANCELLED],
  [CONFIRMED]: [COMPLETED, CANCELLED],
  [COMPLETED]: [],
  [CANCELLED]: [],
}

/** Se `role` pode levar um agendamento de `from` para `to`. Clientes só podem cancelar. */
export function canTransition(
  role: 'client' | 'barber' | 'admin',
  from: AppointmentStatus,
  to: AppointmentStatus,
): boolean {
  if (from === to) return true
  if (!STATUS_TRANSITIONS[from].includes(to)) return false
  if (role === 'client') return to === CANCELLED
  return true
}

/** Status que o papel pode escolher a partir do atual (inclui o atual). */
export const allowedStatuses = (
  role: 'client' | 'barber' | 'admin',
  from: AppointmentStatus,
): AppointmentStatus[] => APPOINTMENT_STATUSES.filter((to) => canTransition(role, from, to))

export const occupiesSlot = (status: AppointmentStatus): boolean =>
  ACTIVE_APPOINTMENT_STATUSES.includes(status)
