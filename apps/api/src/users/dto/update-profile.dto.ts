import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

/** Campos que o próprio usuário pode alterar. */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName?: string

  /** Telefone com DDD, só dígitos e separadores comuns. */
  @IsOptional()
  @IsString()
  @Matches(/^[\d\s()+-]{8,20}$/, { message: 'phone inválido' })
  phone?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string
}
