import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Response } from 'express'

import { AppConfigService } from '../config/app-config.service'

export class GoogleAuthFailedException extends UnauthorizedException {
  constructor(readonly reason: string) {
    super(reason)
  }
}

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(_context: ExecutionContext) {
    return { session: false, prompt: 'select_account' }
  }

  handleRequest<TUser>(err: unknown, user: TUser | false): TUser {
    if (err || !user) {
      const reason = err instanceof UnauthorizedException ? err.message : 'GOOGLE_AUTH_FAILED'
      throw new GoogleAuthFailedException(reason)
    }
    return user
  }
}

/** Em vez de JSON, devolve o usuário para a tela de login do front com o motivo do erro. */
@Catch(GoogleAuthFailedException)
@Injectable()
export class GoogleAuthFailureFilter implements ExceptionFilter {
  constructor(private readonly config: AppConfigService) {}

  catch(exception: GoogleAuthFailedException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>()
    const url = new URL('/login', this.config.get('FRONTEND_URL'))
    url.searchParams.set('error', exception.reason)
    res.redirect(url.toString())
  }
}
