/**
 * Sobe a aplicação inteira (módulos, guards, pipes, filtros) sem banco de dados e verifica o
 * comportamento HTTP que não depende do Mongo: autenticação, papéis, validação e o fluxo do Google.
 */
import { Role } from '@barbearia/shared'
import { Global, INestApplication, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { getConnectionToken } from '@nestjs/mongoose'
import { Test } from '@nestjs/testing'
import mongoose from 'mongoose'
import request from 'supertest'

import { AppModule, DatabaseModule } from '../src/app.module'
import { configureApp } from '../src/setup'

import { E2E_ENV as ENV } from './setup-env'

/** Conexão que nunca abre: os models existem, mas nenhuma rota testada aqui chega a consultá-los. */
@Global()
@Module({
  providers: [{ provide: getConnectionToken(), useValue: mongoose.createConnection() }],
  exports: [getConnectionToken()],
})
class FakeDatabaseModule {}

describe('API (e2e, sem banco)', () => {
  let app: INestApplication
  let tokenFor: (role: Role) => string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideModule(DatabaseModule)
      .useModule(FakeDatabaseModule)
      .compile()

    app = moduleRef.createNestApplication()
    configureApp(app)
    await app.init()

    const jwt = app.get(JwtService)
    tokenFor = (role) =>
      jwt.sign(
        { sub: '000000000000000000000001', email: 'e2e@x.com', role, name: 'E2E' },
        { secret: ENV.JWT_ACCESS_SECRET, expiresIn: '5m' },
      )
  })

  afterAll(() => app.close())

  const auth = (role: Role) => ({ Authorization: `Bearer ${tokenFor(role)}` })

  it('GET /health é público', () =>
    request(app.getHttpServer()).get('/health').expect(200, { status: 'ok' }))

  it('rotas protegidas exigem token', () =>
    request(app.getHttpServer()).get('/users/me').expect(401))

  it('token inválido é recusado', () =>
    request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', 'Bearer abc.def.ghi')
      .expect(401))

  it('cliente não lista usuários', () =>
    request(app.getHttpServer()).get('/users').set(auth(Role.CLIENT)).expect(403))

  it('barbeiro não cria agendamento', () =>
    request(app.getHttpServer()).post('/appointments').set(auth(Role.BARBER)).send({}).expect(403))

  it('valida o corpo do agendamento', async () => {
    const res = await request(app.getHttpServer())
      .post('/appointments')
      .set(auth(Role.CLIENT))
      .send({ barberId: 'x', date: 'ontem', service: 'cabelo', extra: true })
      .expect(400)
    expect(res.body.message).toEqual(
      expect.arrayContaining(['property extra should not exist', 'barberId must be a mongodb id']),
    )
  })

  it('recusa id malformado na URL', async () => {
    const res = await request(app.getHttpServer())
      .get('/appointments/123')
      .set(auth(Role.CLIENT))
      .expect(400)
    expect(res.body.message).toBe('INVALID_ID')
  })

  it('valida a lista de horários', () =>
    request(app.getHttpServer())
      .post('/barbers/000000000000000000000002/availability')
      .set(auth(Role.BARBER))
      .send({ slots: [] })
      .expect(400))

  it('refresh exige um JWT', () =>
    request(app.getHttpServer()).post('/auth/refresh').send({ refreshToken: 'x' }).expect(400))

  it('GET /auth/google redireciona para o Google com seleção de conta', async () => {
    const res = await request(app.getHttpServer()).get('/auth/google').expect(302)
    const location = new URL(res.headers.location)
    expect(location.hostname).toBe('accounts.google.com')
    expect(location.searchParams.get('prompt')).toBe('select_account')
    expect(location.searchParams.get('redirect_uri')).toBe(ENV.GOOGLE_CALLBACK_URL)
  })

  it('login negado no Google volta para a tela de login do front', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/google/redirect?error=access_denied')
      .expect(302)
    expect(res.headers.location).toBe('http://localhost:3001/login?error=GOOGLE_AUTH_FAILED')
  })

  it('serve a documentação fora de produção', () =>
    request(app.getHttpServer()).get('/docs-json').expect(200))
})
