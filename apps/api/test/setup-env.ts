/** Carregado antes dos imports: o ConfigModule valida o ambiente assim que o AppModule é importado. */
export const E2E_ENV = {
  NODE_ENV: 'test',
  MONGO_URL: 'mongodb://127.0.0.1:1/unused',
  JWT_ACCESS_SECRET: 'e2e-access',
  JWT_REFRESH_SECRET: 'e2e-refresh',
  GOOGLE_CLIENT_ID: 'e2e-client-id',
  GOOGLE_CLIENT_SECRET: 'e2e-client-secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:3000/auth/google/redirect',
  FRONTEND_URL: 'http://localhost:3001',
}

Object.assign(process.env, E2E_ENV)
