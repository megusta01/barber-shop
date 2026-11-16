import { SERVICE_TYPES, ServiceType } from '@barbearia/shared'
import { Type } from 'class-transformer'
import { IsDate, IsIn, IsMongoId, IsOptional } from 'class-validator'

export class CreateAppointmentDto {
  @IsMongoId()
  barberId: string

  /** Precisa ser um dos horários disponíveis do barbeiro. */
  @Type(() => Date)
  @IsDate()
  date: Date

  @IsIn(SERVICE_TYPES)
  service: ServiceType

  /** Só administradores podem agendar em nome de outro cliente. */
  @IsOptional()
  @IsMongoId()
  customerId?: string
}
