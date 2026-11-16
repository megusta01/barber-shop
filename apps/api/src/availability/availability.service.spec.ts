import { ErrorCode, Role } from '@barbearia/shared'
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common'

import type { AuthUser } from '../common/types'
import { oid, queryMock } from '../test-utils/query-mock'
import { AvailabilityService } from './availability.service'

const BARBER: AuthUser = { sub: oid(2), email: 'b@x.com', role: Role.BARBER, name: 'Barbeiro' }
const OTHER: AuthUser = { ...BARBER, sub: oid(9) }
const ADMIN: AuthUser = { sub: oid(3), email: 'a@x.com', role: Role.ADMIN, name: 'Admin' }

const inHours = (h: number) => new Date(Date.now() + h * 3_600_000)

function setup(availability: Date[] = [], booked: string[] = []) {
  const schedules = {
    findOne: jest.fn(() => queryMock({ availability })),
    updateOne: jest.fn(() => queryMock({})),
  }
  const users = { exists: jest.fn().mockResolvedValue({ _id: BARBER.sub }) }
  const appointments = { findBookedDates: jest.fn().mockResolvedValue(new Set(booked)) }
  const service = new AvailabilityService(schedules as any, users as any, appointments as any)
  return { service, schedules, appointments }
}

describe('AvailabilityService', () => {
  it('lista só horários futuros, em ordem, marcando os reservados', async () => {
    const later = inHours(48)
    const sooner = inHours(2)
    const past = inHours(-2)
    const { service } = setup([later, past, sooner], [sooner.toISOString()])

    const result = await service.get(BARBER.sub)

    expect(result.slots).toEqual([
      { date: sooner.toISOString(), booked: true },
      { date: later.toISOString(), booked: false },
    ])
  })

  it('barbeiro só mexe na própria agenda', async () => {
    const { service } = setup()
    await expect(service.addSlots(OTHER, BARBER.sub, [inHours(5)])).rejects.toThrow(
      ForbiddenException,
    )
  })

  it('admin mexe na agenda de qualquer barbeiro', async () => {
    const { service, schedules } = setup()
    const slot = inHours(5)
    await service.addSlots(ADMIN, BARBER.sub, [slot])
    expect(schedules.updateOne).toHaveBeenCalledWith(
      { barber: BARBER.sub },
      { $addToSet: { availability: { $each: [slot] } } },
      { upsert: true },
    )
  })

  it('não aceita horário no passado', async () => {
    const { service } = setup()
    await expect(service.addSlots(BARBER, BARBER.sub, [inHours(-1)])).rejects.toThrow(
      new BadRequestException(ErrorCode.SLOT_IN_PAST),
    )
  })

  it('não remove horário que já tem agendamento', async () => {
    const slot = inHours(5)
    const { service, schedules } = setup([slot], [slot.toISOString()])
    await expect(service.removeSlots(BARBER, BARBER.sub, [slot])).rejects.toThrow(ConflictException)
    expect(schedules.updateOne).not.toHaveBeenCalled()
  })
})
