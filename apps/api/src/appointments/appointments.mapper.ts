import type { AppointmentDto, PersonRef } from '@barbearia/shared'
import type { Types } from 'mongoose'

import type { Appointment } from './appointment.schema'

type PopulatedRef = { _id: Types.ObjectId; displayName: string } | Types.ObjectId | null

export type PopulatedAppointment = Omit<Appointment, 'customer' | 'barber'> & {
  _id: Types.ObjectId
  customer: PopulatedRef
  barber: PopulatedRef
}

const toPersonRef = (ref: PopulatedRef): PersonRef => {
  if (ref && 'displayName' in ref) return { id: ref._id.toString(), displayName: ref.displayName }
  return { id: ref ? ref.toString() : '', displayName: 'Usuário removido' }
}

export const toAppointmentDto = (appointment: PopulatedAppointment): AppointmentDto => ({
  id: appointment._id.toString(),
  date: new Date(appointment.date).toISOString(),
  service: appointment.service,
  status: appointment.status,
  isPaid: Boolean(appointment.isPaid),
  customer: toPersonRef(appointment.customer),
  barber: toPersonRef(appointment.barber),
  createdAt: new Date(appointment.createdAt).toISOString(),
})
