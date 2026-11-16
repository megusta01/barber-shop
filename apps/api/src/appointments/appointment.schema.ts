import {
  APPOINTMENT_STATUSES,
  AppointmentStatus,
  SERVICE_TYPES,
  ServiceType,
} from '@barbearia/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { User } from '../users/user.schema'

@Schema({ timestamps: true, collection: 'appointments' })
export class Appointment {
  @Prop({ required: true })
  date: Date

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  customer: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  barber: Types.ObjectId

  @Prop({ type: String, enum: APPOINTMENT_STATUSES, default: AppointmentStatus.PENDING })
  status: AppointmentStatus

  @Prop({ type: String, enum: SERVICE_TYPES, required: true })
  service: ServiceType

  @Prop({ default: false })
  isPaid: boolean

  /**
   * `<barberId>:<dataISO>` enquanto o agendamento ocupa o horário (pendente/confirmado).
   * O índice único impede dois agendamentos ativos no mesmo horário, mesmo em requisições
   * simultâneas. É removido quando o agendamento é cancelado ou concluído.
   */
  @Prop({ type: String, unique: true, sparse: true })
  slotKey?: string

  createdAt: Date
  updatedAt: Date
}

export type AppointmentDocument = HydratedDocument<Appointment>

export const AppointmentSchema = SchemaFactory.createForClass(Appointment)
AppointmentSchema.index({ barber: 1, date: 1 })

export const buildSlotKey = (barberId: string | Types.ObjectId, date: Date): string =>
  `${barberId.toString()}:${date.toISOString()}`
