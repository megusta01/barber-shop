import { AuthTokens, ErrorCode, JwtPayload, Role } from '@barbearia/shared'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService, JwtSignOptions } from '@nestjs/jwt'

import { AppConfigService } from '../config/app-config.service'
import { UsersService } from '../users/users.service'

export interface TokenSubject {
  id: string
  email: string
  role: Role
  displayName: string
}

/** Ex.: '15m', '7d' (formato da lib `ms`). */
type Ttl = JwtSignOptions['expiresIn']

interface RefreshPayload {
  sub: string
  typ: 'refresh'
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
    private readonly users: UsersService,
  ) {}

  async issueTokens(user: TokenSubject): Promise<AuthTokens> {
    const access: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.displayName,
    }
    const refresh: RefreshPayload = { sub: user.id, typ: 'refresh' }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(access, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_TTL') as Ttl,
      }),
      this.jwt.signAsync(refresh, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_TTL') as Ttl,
      }),
    ])

    return { accessToken, refreshToken }
  }

  /**
   * Gera um novo par de tokens. Os dados do usuário são relidos do banco, então mudanças de
   * papel ou desativação feitas pelo admin passam a valer no próximo refresh.
   */
  async refresh(refreshToken: string): Promise<AuthTokens> {
    let payload: RefreshPayload
    try {
      payload = await this.jwt.verifyAsync<RefreshPayload>(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      })
    } catch {
      throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)
    }
    if (payload.typ !== 'refresh') throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)

    const user = await this.users.findDocumentById(payload.sub)
    if (!user) throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)
    if (user.isActive === false) throw new UnauthorizedException(ErrorCode.USER_INACTIVE)

    return this.issueTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    })
  }

  /**
   * URL do front que recebe os tokens. Eles vão no fragmento (#), que o navegador não envia
   * em requisições, então não aparecem em logs de servidor nem no header Referer.
   */
  buildLoginCallbackUrl(tokens: AuthTokens, isFirstLogin: boolean): string {
    const url = new URL('/login/callback', this.config.get('FRONTEND_URL'))
    url.hash = new URLSearchParams({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      first_login: isFirstLogin ? '1' : '0',
    }).toString()
    return url.toString()
  }
}
