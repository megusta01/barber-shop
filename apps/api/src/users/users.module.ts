import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { Appointment, AppointmentSchema } from '../appointments/appointment.schema'
import { BarberSchedule, BarberScheduleSchema } from '../availability/barber-schedule.schema'
import { User, UserSchema } from './user.schema'
import { BarbersController, UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: BarberSchedule.name, schema: BarberScheduleSchema },
    ]),
  ],
  controllers: [UsersController, BarbersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
