import { ErrorCode } from '@barbearia/shared'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'

import { AppConfigService } from '../config/app-config.service'
import { UserDocument } from '../users/user.schema'
import { UsersService } from '../users/users.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: AppConfigService,
    private readonly users: UsersService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): Promise<UserDocument> {
    const email = profile.emails?.[0]?.value
    if (!email) throw new UnauthorizedException(ErrorCode.INVALID_TOKEN)

    const user = await this.users.findOrCreateFromGoogle({
      googleId: profile.id,
      email,
      displayName: profile.displayName || email.split('@')[0],
      avatarUrl: profile.photos?.[0]?.value ?? '',
    })

    if (user.isActive === false) throw new UnauthorizedException(ErrorCode.USER_INACTIVE)
    return user
  }
}
