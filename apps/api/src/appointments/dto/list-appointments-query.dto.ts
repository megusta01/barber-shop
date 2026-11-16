import { APPOINTMENT_STATUSES, AppointmentStatus } from '@barbearia/shared'
import { Type } from 'class-transformer'
import { IsDate, IsIn, IsMongoId, IsOptional } from 'class-validator'

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'

export class ListAppointmentsQueryDto extends PaginationQueryDto {
  /** Início do intervalo (inclusivo). */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: Date

  /** Fim do intervalo (exclusivo). */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: Date

  @IsOptional()
  @IsIn(APPOINTMENT_STATUSES)
  status?: AppointmentStatus

  /** Filtro de administrador. Barbeiros e clientes sempre veem só os próprios. */
  @IsOptional()
  @IsMongoId()
  barberId?: string

  /** Filtro de administrador. */
  @IsOptional()
  @IsMongoId()
  customerId?: string

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order: 'asc' | 'desc' = 'asc'
}
