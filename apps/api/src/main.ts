import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { AppConfigService } from './config/app-config.service'
import { configureApp } from './setup'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  configureApp(app)
  app.enableShutdownHooks()

  const port = app.get(AppConfigService).get('PORT')
  await app.listen(port)
  Logger.log(`API ouvindo na porta ${port}`, 'Bootstrap')
}

void bootstrap()
