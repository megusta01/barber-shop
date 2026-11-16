import { APPOINTMENT_STATUSES, AppointmentStatus } from '@barbearia/shared'
import { IsBoolean, IsIn, IsOptional } from 'class-validator'

export class UpdateAppointmentDto {
  @IsOptional()
  @IsIn(APPOINTMENT_STATUSES)
  status?: AppointmentStatus

  /** Apenas barbeiro ou administrador. */
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean
}
