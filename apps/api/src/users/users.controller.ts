import { BarberDto, Paginated, Role, UserDto } from '@barbearia/shared'
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe'
import type { AuthUser } from '../common/types'
import { AdminUpdateUserDto } from './dto/admin-update-user.dto'
import { ListUsersQueryDto } from './dto/list-users-query.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { UsersService } from './users.service'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  /** Perfil do usuário logado. */
  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<UserDto> {
    return this.users.getById(user.sub)
  }

  /** Atualiza o próprio perfil (também conclui o primeiro acesso). */
  @Patch('me')
  updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto): Promise<UserDto> {
    return this.users.updateProfile(user.sub, dto)
  }

  @Get()
  @Roles(Role.ADMIN)
  list(@Query() query: ListUsersQueryDto): Promise<Paginated<UserDto>> {
    return this.users.list(query)
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<UserDto> {
    return this.users.getById(id)
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<UserDto> {
    return this.users.adminUpdate(id, dto)
  }

  @Patch(':id/role')
  @Roles(Role.ADMIN)
  updateRole(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() actor: AuthUser,
  ): Promise<UserDto> {
    return this.users.updateRole(id, dto.role, actor.sub)
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  remove(
    @Param('id', ParseObjectIdPipe) id: string,
    @CurrentUser() actor: AuthUser,
  ): Promise<void> {
    return this.users.remove(id, actor.sub)
  }
}

@ApiTags('barbers')
@ApiBearerAuth()
@Controller('barbers')
export class BarbersController {
  constructor(private readonly users: UsersService) {}

  /** Lista pública (para usuários logados) dos barbeiros ativos. */
  @Get()
  list(): Promise<BarberDto[]> {
    return this.users.listBarbers()
  }
}
