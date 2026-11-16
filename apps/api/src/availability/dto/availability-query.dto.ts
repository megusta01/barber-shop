import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

export class AvailabilityQueryDto {
  /** Inclui horários que já passaram (padrão: false). */
  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  includePast = false
}
