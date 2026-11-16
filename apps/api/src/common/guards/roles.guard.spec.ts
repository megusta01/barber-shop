import { Role } from '@barbearia/shared'
import { ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { RolesGuard } from './roles.guard'

const contextFor = (role?: Role) =>
  ({
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ user: role ? { role } : undefined }) }),
  }) as unknown as ExecutionContext

describe('RolesGuard', () => {
  const reflector = new Reflector()
  const guard = new RolesGuard(reflector)

  it('libera rotas sem @Roles', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined)
    expect(guard.canActivate(contextFor(Role.CLIENT))).toBe(true)
  })

  it('libera quando o papel está na lista', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN, Role.BARBER])
    expect(guard.canActivate(contextFor(Role.BARBER))).toBe(true)
  })

  it('bloqueia quando o papel não está na lista', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN])
    expect(() => guard.canActivate(contextFor(Role.CLIENT))).toThrow(ForbiddenException)
  })

  it('bloqueia quando não há usuário', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN])
    expect(() => guard.canActivate(contextFor())).toThrow(ForbiddenException)
  })
})
