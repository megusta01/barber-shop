import { Role, ROLES } from '@barbearia/shared'
import { IsIn } from 'class-validator'

export class UpdateRoleDto {
  @IsIn(ROLES)
  role: Role
}
