import type { Role } from '@barbearia/shared'
import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/** Restringe a rota aos papéis informados. Sem o decorator, qualquer usuário autenticado passa. */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
