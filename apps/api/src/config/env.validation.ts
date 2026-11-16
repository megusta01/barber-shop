import { plainToInstance, Type } from 'class-transformer'
import { IsIn, IsInt, IsNotEmpty, IsString, IsUrl, Max, Min, validateSync } from 'class-validator'

export class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test' = 'development'

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT : number = 3000

  @IsString()
  @IsNotEmpty()
  MONGO_URL: string

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET: string

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET: string

  @IsString()
  JWT_ACCESS_TTL = '15m'

  @IsString()
  JWT_REFRESH_TTL = '7d'

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string

  @IsUrl({ require_tld: false })
  GOOGLE_CALLBACK_URL: string

  @IsUrl({ require_tld: false })
  FRONTEND_URL: string
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true })
  const errors = validateSync(env, { skipMissingProperties: false })

  if (errors.length > 0) {
    const details = errors
      .map((e) => `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`)
      .join('\n')
    throw new Error(`Variáveis de ambiente inválidas:\n${details}`)
  }

  return env
}
