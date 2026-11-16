import { AppointmentDto, Paginated, Role } from '@barbearia/shared'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe'
import type { AuthUser } from '../common/types'
import { AppointmentsService } from './appointments.service'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto'
import { UpdateAppointmentDto } from './dto/update-appointment.dto'

@ApiTags('appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  /** Agenda um horário disponível de um barbeiro. */
  @Post()
  @Roles(Role.CLIENT, Role.ADMIN)
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateAppointmentDto,
  ): Promise<AppointmentDto> {
    return this.appointments.create(user, dto)
  }

  /** Lista os agendamentos visíveis para o usuário logado. */
  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query() query: ListAppointmentsQueryDto,
  ): Promise<Paginated<AppointmentDto>> {
    return this.appointments.list(user, query)
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<AppointmentDto> {
    return this.appointments.findOne(user, id)
  }

  /** Muda status e/ou pagamento. Clientes só podem cancelar. */
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ): Promise<AppointmentDto> {
    return this.appointments.update(user, id, dto)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    return this.appointments.remove(id)
  }
}
