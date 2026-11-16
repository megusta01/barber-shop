import { ErrorCode, Role } from '@barbearia/shared'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Types } from 'mongoose'

import { oid } from '../test-utils/query-mock'
import { AuthService } from './auth.service'

const env: Record<string, string> = {
  JWT_ACCESS_SECRET: 'access-secret',
  JWT_REFRESH_SECRET: 'refresh-secret',
  JWT_ACCESS_TTL: '15m',
  JWT_REFRESH_TTL: '7d',
  FRONTEND_URL: 'http://localhost:3001',
}

function setup(user: Record<string, unknown> | null) {
  const jwt = new JwtService()
  const config = { get: (key: string) => env[key] }
  const users = { findDocumentById: jest.fn().mockResolvedValue(user) }
  const service = new AuthService(jwt, config as any, users as any)
  return { service, jwt }
}

const subject = { id: oid(1), email: 'c@x.com', role: Role.CLIENT, displayName: 'Cliente' }

describe('AuthService', () => {
  it('access token carrega sub, email, papel e nome', async () => {
    const { service, jwt } = setup(null)
    const { accessToken } = await service.issueTokens(subject)
    const payload = jwt.verify(accessToken, { secret: env.JWT_ACCESS_SECRET })
    expect(payload).toMatchObject({
      sub: oid(1),
      email: 'c@x.com',
      role: 'client',
      name: 'Cliente',
    })
  })

  it('refresh relê o usuário e reflete a mudança de papel', async () => {
    const { service, jwt } = setup({
      _id: new Types.ObjectId(oid(1)),
      email: 'c@x.com',
      role: Role.BARBER,
      displayName: 'Cliente',
      isActive: true,
    })
    const { refreshToken } = await service.issueTokens(subject)

    const tokens = await service.refresh(refreshToken)

    expect(jwt.decode(tokens.accessToken)).toMatchObject({ role: 'barber' })
  })

  it('refresh recusa access token no lugar do refresh', async () => {
    const { service } = setup(null)
    const { accessToken } = await service.issueTokens(subject)
    await expect(service.refresh(accessToken)).rejects.toThrow(UnauthorizedException)
  })

  it('refresh recusa usuário desativado', async () => {
    const { service } = setup({ _id: new Types.ObjectId(oid(1)), isActive: false })
    const { refreshToken } = await service.issueTokens(subject)
    await expect(service.refresh(refreshToken)).rejects.toThrow(
      new UnauthorizedException(ErrorCode.USER_INACTIVE),
    )
  })

  it('manda os tokens para o front no fragmento da URL', () => {
    const { service } = setup(null)
    const url = new URL(
      service.buildLoginCallbackUrl({ accessToken: 'a', refreshToken: 'r' }, true),
    )
    expect(url.origin + url.pathname).toBe('http://localhost:3001/login/callback')
    expect(url.search).toBe('')
    expect(new URLSearchParams(url.hash.slice(1)).get('first_login')).toBe('1')
  })
})
