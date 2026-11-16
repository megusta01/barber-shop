import { AppointmentStatus, Role } from '@barbearia/shared'

const { PENDING, CONFIRMED, COMPLETED, CANCELLED } = AppointmentStatus

/** Transições de status permitidas. Concluído e cancelado são finais. */
export const STATUS_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  [PENDING]: [CONFIRMED, COMPLETED, CANCELLED],
  [CONFIRMED]: [COMPLETED, CANCELLED],
  [COMPLETED]: [],
  [CANCELLED]: [],
}

export function canTransition(role: Role, from: AppointmentStatus, to: AppointmentStatus): boolean {
  if (from === to) return true
  if (!STATUS_TRANSITIONS[from].includes(to)) return false
  // cliente só pode cancelar
  if (role === Role.CLIENT) return to === CANCELLED
  return true
}

export const occupiesSlot = (status: AppointmentStatus): boolean =>
  status === PENDING || status === CONFIRMED
