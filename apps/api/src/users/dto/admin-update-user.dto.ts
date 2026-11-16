import { IsBoolean, IsOptional } from 'class-validator'

import { UpdateProfileDto } from './update-profile.dto'

/** Campos que um administrador pode alterar em qualquer usuário. */
export class AdminUpdateUserDto extends UpdateProfileDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
