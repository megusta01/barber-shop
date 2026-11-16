import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDate } from 'class-validator'

export class SlotsDto {
  /** Datas/horas em ISO 8601. */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => Date)
  @IsDate({ each: true })
  slots: Date[]
}
