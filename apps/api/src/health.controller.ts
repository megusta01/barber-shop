import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { SkipThrottle } from '@nestjs/throttler'

import { Public } from './common/decorators/public.decorator'

@ApiTags('health')
@Public()
@SkipThrottle()
@Controller('health')
export class HealthController {
  /** Usado pelo Render/Docker para saber se a API está de pé. */
  @Get()
  check(): { status: 'ok' } {
    return { status: 'ok' }
  }
}
