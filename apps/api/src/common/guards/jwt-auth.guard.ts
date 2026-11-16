import { ErrorCode, JwtPayload } from '@barbearia/shared'
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'

import { AppConfigService } from '../../config/app-config.service'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request & { user?: JwtPayload }>()
    const token = this.extractBearer(request)
    if (!token) throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)

    try {
      request.user = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      })
    } catch {
      throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)
    }

    return true
  }

  private extractBearer(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' && token ? token : undefined
  }
}
