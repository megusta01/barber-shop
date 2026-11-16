import { AppointmentStatus, ErrorCode, Role, ServiceType } from '@barbearia/shared'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { Types } from 'mongoose'

import type { AuthUser } from '../common/types'
import { oid, queryMock } from '../test-utils/query-mock'
import { AppointmentsService } from './appointments.service'
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto'

const CLIENT: AuthUser = { sub: oid(1), email: 'c@x.com', role: Role.CLIENT, name: 'Cliente' }
const BARBER: AuthUser = { sub: oid(2), email: 'b@x.com', role: Role.BARBER, name: 'Barbeiro' }
const OTHER_BARBER: AuthUser = { ...BARBER, sub: oid(9) }
const ADMIN: AuthUser = { sub: oid(3), email: 'a@x.com', role: Role.ADMIN, name: 'Admin' }

const future = () => new Date(Date.now() + 86_400_000)

const stored = (overrides: Record<string, unknown> = {}) => ({
  _id: new Types.ObjectId(oid(100)),
  date: future(),
  customer: new Types.ObjectId(CLIENT.sub),
  barber: new Types.ObjectId(BARBER.sub),
  status: AppointmentStatus.PENDING,
  service: ServiceType.HAIRCUT,
  isPaid: false,
  createdAt: new Date(),
  ...overrides,
})

const populated = (overrides: Record<string, unknown> = {}) =>
  stored({
    customer: { _id: new Types.ObjectId(CLIENT.sub), displayName: 'Cliente' },
    barber: { _id: new Types.ObjectId(BARBER.sub), displayName: 'Barbeiro' },
    ...overrides,
  })

function setup() {
  const appointments = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    updateOne: jest.fn(() => queryMock({})),
  }
  const users = { exists: jest.fn().mockResolvedValue({ _id: 'x' }) }
  const schedules = { exists: jest.fn().mockResolvedValue({ _id: 'x' }) }
  const service = new AppointmentsService(appointments as any, users as any, schedules as any)
  return { service, appointments, users, schedules }
}

describe('AppointmentsService.create', () => {
  const dto = () => ({ barberId: BARBER.sub, date: future(), service: ServiceType.HAIRCUT })

  it('cria para o próprio cliente com trava de horário', async () => {
    const { service, appointments } = setup()
    appointments.create.mockResolvedValue({ _id: new Types.ObjectId(oid(100)) })
    appointments.findById.mockReturnValue(queryMock(populated()))

    const input = dto()
    const result = await service.create(CLIENT, input)

    expect(appointments.create).toHaveBeenCalledWith(
      expect.objectContaining({
        customer: CLIENT.sub,
        barber: BARBER.sub,
        slotKey: `${BARBER.sub}:${input.date.toISOString()}`,
      }),
    )
    expect(result.customer.displayName).toBe('Cliente')
  })

  it('recusa horário no passado', async () => {
    const { service } = setup()
    await expect(
      service.create(CLIENT, { ...dto(), date: new Date(Date.now() - 1000) }),
    ).rejects.toThrow(new BadRequestException(ErrorCode.SLOT_IN_PAST))
  })

  it('recusa barbeiro inexistente', async () => {
    const { service, users } = setup()
    users.exists.mockResolvedValueOnce(null)
    await expect(service.create(CLIENT, dto())).rejects.toThrow(NotFoundException)
  })

  it('recusa horário que o barbeiro não oferece', async () => {
    const { service, schedules } = setup()
    schedules.exists.mockResolvedValue(null)
    await expect(service.create(CLIENT, dto())).rejects.toThrow(
      new BadRequestException(ErrorCode.SLOT_UNAVAILABLE),
    )
  })

  it('converte chave duplicada em conflito (horário já reservado)', async () => {
    const { service, appointments } = setup()
    appointments.create.mockRejectedValue({ code: 11000 })
    await expect(service.create(CLIENT, dto())).rejects.toThrow(ConflictException)
  })

  it('cliente não agenda em nome de outra pessoa', async () => {
    const { service } = setup()
    await expect(service.create(CLIENT, { ...dto(), customerId: oid(50) })).rejects.toThrow(
      ForbiddenException,
    )
  })
})

describe('AppointmentsService.update', () => {
  it('cliente cancela o próprio agendamento e libera o horário', async () => {
    const { service, appointments } = setup()
    appointments.findById
      .mockReturnValueOnce(queryMock(stored()))
      .mockReturnValueOnce(queryMock(populated({ status: AppointmentStatus.CANCELLED })))

    await service.update(CLIENT, oid(100), { status: AppointmentStatus.CANCELLED })

    expect(appointments.updateOne).toHaveBeenCalledWith(
      { _id: expect.anything() },
      { $set: { status: AppointmentStatus.CANCELLED }, $unset: { slotKey: 1 } },
    )
  })

  it('cliente não confirma', async () => {
    const { service, appointments } = setup()
    appointments.findById.mockReturnValue(queryMock(stored()))
    await expect(
      service.update(CLIENT, oid(100), { status: AppointmentStatus.CONFIRMED }),
    ).rejects.toThrow(new BadRequestException(ErrorCode.STATUS_TRANSITION_NOT_ALLOWED))
  })

  it('cliente não marca pagamento', async () => {
    const { service, appointments } = setup()
    appointments.findById.mockReturnValue(queryMock(stored()))
    await expect(service.update(CLIENT, oid(100), { isPaid: true })).rejects.toThrow(
      ForbiddenException,
    )
  })

  it('barbeiro confirma sem liberar o horário', async () => {
    const { service, appointments } = setup()
    appointments.findById
      .mockReturnValueOnce(queryMock(stored()))
      .mockReturnValueOnce(queryMock(populated()))

    await service.update(BARBER, oid(100), { status: AppointmentStatus.CONFIRMED, isPaid: true })

    expect(appointments.updateOne).toHaveBeenCalledWith(
      { _id: expect.anything() },
      { $set: { isPaid: true, status: AppointmentStatus.CONFIRMED } },
    )
  })

  it('barbeiro não vê agendamento de outro barbeiro', async () => {
    const { service, appointments } = setup()
    appointments.findById.mockReturnValue(queryMock(stored()))
    await expect(
      service.update(OTHER_BARBER, oid(100), { status: AppointmentStatus.CONFIRMED }),
    ).rejects.toThrow(NotFoundException)
  })
})

describe('AppointmentsService.list', () => {
  const query = (overrides: Partial<ListAppointmentsQueryDto> = {}) =>
    Object.assign(new ListAppointmentsQueryDto(), overrides)

  it.each([
    [CLIENT, { customer: CLIENT.sub }],
    [BARBER, { barber: BARBER.sub }],
    [ADMIN, {}],
  ])('restringe pelo papel (%#)', async (actor, expected) => {
    const { service, appointments } = setup()
    appointments.find.mockReturnValue(queryMock([populated()]))
    appointments.countDocuments.mockReturnValue(queryMock(1))

    // filtros de admin são ignorados para os outros papéis
    const result = await service.list(actor, query({ barberId: oid(77) }))

    const expectedFilter = actor.role === Role.ADMIN ? { barber: oid(77) } : expected
    expect(appointments.find).toHaveBeenCalledWith(expectedFilter)
    expect(result).toMatchObject({ total: 1, page: 1, limit: 20 })
    expect(result.items[0].barber.displayName).toBe('Barbeiro')
  })
})
