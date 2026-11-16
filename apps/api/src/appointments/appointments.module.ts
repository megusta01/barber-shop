import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { BarberSchedule, BarberScheduleSchema } from '../availability/barber-schedule.schema'
import { User, UserSchema } from '../users/user.schema'
import { Appointment, AppointmentSchema } from './appointment.schema'
import { AppointmentsController } from './appointments.controller'
import { AppointmentsService } from './appointments.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: User.name, schema: UserSchema },
      { name: BarberSchedule.name, schema: BarberScheduleSchema },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
