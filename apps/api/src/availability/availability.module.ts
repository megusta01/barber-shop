import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AppointmentsModule } from '../appointments/appointments.module'
import { User, UserSchema } from '../users/user.schema'
import { AvailabilityController } from './availability.controller'
import { AvailabilityService } from './availability.service'
import { BarberSchedule, BarberScheduleSchema } from './barber-schedule.schema'

@Module({
  imports: [
    AppointmentsModule,
    MongooseModule.forFeature([
      { name: BarberSchedule.name, schema: BarberScheduleSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
})
export class AvailabilityModule {}
