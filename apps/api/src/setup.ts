import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'

import { AppConfigService } from './config/app-config.service'

/** Middlewares, pipes e docs. Compartilhado entre o bootstrap e os testes e2e. */
export function configureApp(app: INestApplication): void {
  const config = app.get(AppConfigService)

  app.use(helmet())
  app.enableCors({
    origin: config.get('FRONTEND_URL'),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  )

  if (!config.isProduction) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle('Barbearia API').setVersion('1.0').addBearerAuth().build(),
    )
    SwaggerModule.setup('docs', app, document)
  }
}
