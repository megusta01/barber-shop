import type { JwtPayload } from '@barbearia/shared'
import type { Request } from 'express'

/** Usuário autenticado anexado à requisição pelo JwtAuthGuard. */
export type AuthUser = JwtPayload

export interface AuthenticatedRequest extends Request {
  user: AuthUser
}
