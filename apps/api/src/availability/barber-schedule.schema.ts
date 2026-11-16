import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

import { User } from '../users/user.schema'

@Schema({ timestamps: true, collection: 'barberschedules' })
export class BarberSchedule {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  barber: Types.ObjectId

  /** Horários em que o barbeiro aceita agendamentos. */
  @Prop({ type: [Date], default: [] })
  availability: Date[]
}

export type BarberScheduleDocument = HydratedDocument<BarberSchedule>

export const BarberScheduleSchema = SchemaFactory.createForClass(BarberSchedule)
