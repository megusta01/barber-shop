import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { AppointmentsModule } from './appointments/appointments.module'
import { AuthModule } from './auth/auth.module'
import { AvailabilityModule } from './availability/availability.module'
import { JwtAuthGuard } from './common/guards/jwt-auth.guard'
import { RolesGuard } from './common/guards/roles.guard'
import { AppConfigService } from './config/app-config.service'
import { AppConfigModule } from './config/config.module'
import { HealthController } from './health.controller'
import { UsersModule } from './users/users.module'

export const DatabaseModule = MongooseModule.forRootAsync({
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) => ({ uri: config.get('MONGO_URL') }),
})

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    // segredos e expiração são passados em cada sign/verify (access e refresh usam segredos diferentes)
    JwtModule.register({ global: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    AuthModule,
    UsersModule,
    AppointmentsModule,
    AvailabilityModule,
  ],
  controllers: [HealthController],
  providers: [
    // a ordem importa: limite de requisições → autenticação → papéis
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
