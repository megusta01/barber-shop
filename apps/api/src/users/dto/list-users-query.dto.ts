import { Role, ROLES } from '@barbearia/shared'
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator'

import { PaginationQueryDto } from '../../common/dto/pagination-query.dto'

export class ListUsersQueryDto extends PaginationQueryDto {
  /** Busca por nome ou e-mail (parcial, sem diferenciar maiúsculas). */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  search?: string

  @IsOptional()
  @IsIn(ROLES)
  role?: Role
}
