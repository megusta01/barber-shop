import { AuthTokens } from '@barbearia/shared'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'
import type { Request, Response } from 'express'

import { Public } from '../common/decorators/public.decorator'
import type { UserDocument } from '../users/user.schema'
import { AuthService } from './auth.service'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { GoogleAuthFailureFilter, GoogleAuthGuard } from './google-auth.guard'

@ApiTags('auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  /** Inicia o login com Google (abrir no navegador). */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {
    // o guard redireciona para o Google
  }

  @Get('google/redirect')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleAuthGuard)
  @UseFilters(GoogleAuthFailureFilter)
  async googleRedirect(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as UserDocument
    const tokens = await this.auth.issueTokens({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      displayName: user.displayName,
    })
    res.redirect(this.auth.buildLoginCallbackUrl(tokens, user.isFirstLogin))
  }

  /** Troca um refresh token válido por um novo par de tokens. */
  @Post('refresh')
  @HttpCode(200)
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  refresh(@Body() dto: RefreshTokenDto): Promise<AuthTokens> {
    return this.auth.refresh(dto.refreshToken)
  }
}
