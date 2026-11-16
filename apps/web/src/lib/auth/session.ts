import type { JwtPayload, Role } from '@barbearia/shared'
import { jwtDecode } from 'jwt-decode'

export interface Session {
  userId: string
  email: string
  role: Role
  name: string
}

/** Lê os dados do usuário do access token. Não valida assinatura: isso é papel da API. */
export function sessionFromToken(token: string | null): Session | null {
  if (!token) return null
  try {
    const payload = jwtDecode<JwtPayload>(token)
    return { userId: payload.sub, email: payload.email, role: payload.role, name: payload.name }
  } catch {
    return null
  }
}

/** Página inicial de cada papel. */
export const homePathFor = (role: Role): string => `/dashboard/${role}`
