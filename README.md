# Barbearia

Sistema de agendamento para barbearias. Clientes entram com a conta Google, escolhem um barbeiro e reservam um horário livre. Barbeiros abrem horários e acompanham os atendimentos. Administradores gerenciam usuários e veem todos os agendamentos.

## Estrutura

```
apps/
  api/        NestJS 11 + MongoDB (Mongoose) — autenticação, usuários, agenda, agendamentos
  web/        Next.js 15 (App Router) + Tailwind — telas de cliente, barbeiro e admin
packages/
  shared/     Tipos, enums e regras usados pelos dois lados (papéis, status, contratos da API)
```

O monorepo usa **npm workspaces**. O pacote `@barbearia/shared` é compilado automaticamente antes de `dev` e `build` de cada app.

## Rodando localmente

Pré-requisitos: Node 20+ (`.nvmrc` aponta para 22) e um MongoDB. Para subir um Mongo local:

```bash
docker compose up -d
```

1. Instale as dependências na raiz:

   ```bash
   npm install
   ```

2. Crie os arquivos de ambiente a partir dos exemplos e preencha:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env.local
   ```

   No [Google Cloud Console](https://console.cloud.google.com/apis/credentials), a URI de redirecionamento autorizada do cliente OAuth precisa ser igual a `GOOGLE_CALLBACK_URL` (por padrão `http://localhost:3000/auth/google/redirect`).

3. Suba a API e o front em terminais separados:

   ```bash
   npm run dev:api   # http://localhost:3000  (docs em /docs)
   npm run dev:web   # http://localhost:3001
   ```

4. O primeiro login cria o usuário como **cliente**. Para ter um administrador, altere o papel direto no banco:

   ```js
   db.users.updateOne({ email: 'voce@gmail.com' }, { $set: { role: 'admin' } })
   ```

   A partir daí, o admin promove barbeiros pela tela de usuários.

## Scripts (raiz)

| Comando             | O que faz                             |
| ------------------- | ------------------------------------- |
| `npm run dev:api`   | API em modo watch                     |
| `npm run dev:web`   | Front em modo dev                     |
| `npm run build`     | Build de produção da API e do front   |
| `npm run lint`      | ESLint em todos os pacotes            |
| `npm run typecheck` | Checagem de tipos em todos os pacotes |
| `npm test`          | Testes unitários da API               |
| `npm run format`    | Prettier no repositório inteiro       |

Na API também há `npm run test:e2e -w @barbearia/api`, que sobe a aplicação completa (sem banco) e testa autenticação, papéis, validação e o fluxo do Google.

## API

Todas as rotas, exceto `/auth/*` e `/health`, exigem `Authorization: Bearer <accessToken>`. Erros 4xx trazem um código em `message` (lista em `packages/shared/src/contracts.ts`).

| Método | Rota                             | Quem                | Descrição                                          |
| ------ | -------------------------------- | ------------------- | -------------------------------------------------- |
| GET    | `/auth/google`                   | público             | Inicia o login com Google                          |
| GET    | `/auth/google/redirect`          | Google              | Callback; redireciona ao front com os tokens       |
| POST   | `/auth/refresh`                  | público             | `{ refreshToken }` → novo par de tokens            |
| GET    | `/users/me` · PATCH `/users/me`  | logado              | Ver/editar o próprio perfil                        |
| GET    | `/users`                         | admin               | Lista paginada (`search`, `role`, `page`, `limit`) |
| PATCH  | `/users/:id` · `/users/:id/role` | admin               | Editar dados/ativo · mudar papel                   |
| DELETE | `/users/:id`                     | admin               | Remove usuário, agendamentos e agenda              |
| GET    | `/barbers`                       | logado              | Barbeiros ativos (dados públicos)                  |
| GET    | `/barbers/:id/availability`      | logado              | Horários futuros com indicação de reservado        |
| POST   | `/barbers/:id/availability`      | o barbeiro ou admin | `{ slots: ISO[] }` adiciona horários               |
| DELETE | `/barbers/:id/availability`      | o barbeiro ou admin | `{ slots: ISO[] }` remove horários sem reserva     |
| POST   | `/appointments`                  | cliente ou admin    | `{ barberId, date, service }`                      |
| GET    | `/appointments`                  | logado              | Lista do usuário (`from`, `to`, `status`, `order`) |
| PATCH  | `/appointments/:id`              | envolvidos ou admin | `{ status?, isPaid? }` — cliente só cancela        |
| DELETE | `/appointments/:id`              | admin               | Remove o agendamento                               |

Regras de status: `pendente → confirmado | concluído | cancelado`, `confirmado → concluído | cancelado`; concluído e cancelado são finais. Um índice único impede dois agendamentos ativos no mesmo horário do mesmo barbeiro.

## Deploy

**API (ex.: Render)** — diretório raiz do repositório:

- Build: `npm ci && npm run build -w @barbearia/api`
- Start: `npm run start -w @barbearia/api`
- Health check: `/health`
- Variáveis: as de `apps/api/.env.example`, com `NODE_ENV=production` (desliga o Swagger) e `FRONTEND_URL` apontando para o front publicado.

Ou com Docker, a partir da raiz: `docker build -f apps/api/Dockerfile -t barbearia-api .`

**Front (ex.: Vercel)** — Root Directory `apps/web`, com `NEXT_PUBLIC_API_BASE_URL` apontando para a API.

## Migrando um banco da versão anterior

A versão anterior gravava os agendamentos com os campos `costumer` e `barberId`. Com a API configurada para o banco antigo, rode uma vez:

```bash
npm run migrate:v2 -w @barbearia/api
```

O script renomeia os campos, cria a trava de horário dos agendamentos ativos e preenche os campos que faltam nos usuários. Ele pode ser executado mais de uma vez sem problemas.

Variáveis que deixaram de existir: `JWT_SECRET`, `JWT_RESET_SECRET` e `REDIS_*`. A variável `FRONTEND_URL` agora precisa apontar para o **front**, porque é para lá que a API redireciona depois do login.
