import { AppointmentStatus, Role } from '@barbearia/shared'

import { canTransition, occupiesSlot } from './appointment-rules'

const { PENDING, CONFIRMED, COMPLETED, CANCELLED } = AppointmentStatus

describe('regras de status', () => {
  it('barbeiro confirma e conclui', () => {
    expect(canTransition(Role.BARBER, PENDING, CONFIRMED)).toBe(true)
    expect(canTransition(Role.BARBER, CONFIRMED, COMPLETED)).toBe(true)
  })

  it('cliente só cancela', () => {
    expect(canTransition(Role.CLIENT, PENDING, CANCELLED)).toBe(true)
    expect(canTransition(Role.CLIENT, PENDING, CONFIRMED)).toBe(false)
    expect(canTransition(Role.CLIENT, CONFIRMED, COMPLETED)).toBe(false)
  })

  it('status finais não mudam, nem para admin', () => {
    expect(canTransition(Role.ADMIN, CANCELLED, PENDING)).toBe(false)
    expect(canTransition(Role.ADMIN, COMPLETED, CANCELLED)).toBe(false)
  })

  it('não volta de confirmado para pendente', () => {
    expect(canTransition(Role.BARBER, CONFIRMED, PENDING)).toBe(false)
  })

  it('só pendente e confirmado ocupam o horário', () => {
    expect([PENDING, CONFIRMED, COMPLETED, CANCELLED].map(occupiesSlot)).toEqual([
      true,
      true,
      false,
      false,
    ])
  })
})
