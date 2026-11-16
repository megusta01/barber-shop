import { AvailabilityDto, Role } from '@barbearia/shared'
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe'
import type { AuthUser } from '../common/types'
import { AvailabilityService } from './availability.service'
import { AvailabilityQueryDto } from './dto/availability-query.dto'
import { SlotsDto } from './dto/slots.dto'

@ApiTags('availability')
@ApiBearerAuth()
@Controller('barbers/:barberId/availability')
export class AvailabilityController {
  constructor(private readonly availability: AvailabilityService) {}

  /** Horários do barbeiro, com indicação dos que já estão reservados. */
  @Get()
  get(
    @Param('barberId', ParseObjectIdPipe) barberId: string,
    @Query() query: AvailabilityQueryDto,
  ): Promise<AvailabilityDto> {
    return this.availability.get(barberId, query.includePast)
  }

  /** Adiciona horários (o próprio barbeiro ou um administrador). */
  @Post()
  @Roles(Role.BARBER, Role.ADMIN)
  add(
    @CurrentUser() user: AuthUser,
    @Param('barberId', ParseObjectIdPipe) barberId: string,
    @Body() dto: SlotsDto,
  ): Promise<AvailabilityDto> {
    return this.availability.addSlots(user, barberId, dto.slots)
  }

  /** Remove horários que ainda não têm agendamento ativo. */
  @Delete()
  @Roles(Role.BARBER, Role.ADMIN)
  remove(
    @CurrentUser() user: AuthUser,
    @Param('barberId', ParseObjectIdPipe) barberId: string,
    @Body() dto: SlotsDto,
  ): Promise<AvailabilityDto> {
    return this.availability.removeSlots(user, barberId, dto.slots)
  }
}
