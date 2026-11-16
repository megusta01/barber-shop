'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { Brand } from '@/components/layout/Brand'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Alert } from '@/components/ui/Alert'
import { authApi } from '@/lib/api/endpoints'
import { loginErrorMessage } from '@/lib/api/errors'
import { useAuth } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}

export function LoginScreen() {
  const { status, session } = useAuth()
  const router = useRouter()
  const error = loginErrorMessage(useSearchParams().get('error'))

  useEffect(() => {
    if (status === 'authenticated' && session) router.replace(homePathFor(session.role))
  }, [status, session, router])

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="relative flex flex-col justify-between bg-charcoal px-6 py-6 text-paper md:w-[44%] md:px-12 md:py-10">
        <div className="pole-stripe absolute inset-x-0 top-0 h-1.5" aria-hidden />
        <Brand href="/" inverted />
        <div className="hidden max-w-sm md:block">
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight">
            Entre para agendar seu corte ou cuidar da sua agenda.
          </p>
          <p className="mt-4 text-stone-300">
            Clientes, barbeiros e a administração da casa usam o mesmo acesso.
          </p>
        </div>
        <span className="hidden md:block" />
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Entrar</h1>
          <p className="mt-2 text-muted">Use sua conta Google. Não é preciso criar senha.</p>

          {error && <Alert className="mt-6">{error}</Alert>}

          {/* navegação completa: o fluxo OAuth passa pelo Google e volta em /login/callback */}
          <a
            href={authApi.googleLoginUrl}
            className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-line bg-white text-sm font-semibold text-ink shadow-sm transition-colors hover:border-muted/50 hover:bg-paper"
          >
            <GoogleIcon />
            Continuar com o Google
          </a>

          <p className="mt-4 text-sm text-muted">
            No primeiro acesso, sua conta é criada com o nome e o e-mail do Google.
          </p>

          <PublicFooter className="mt-10" />
        </div>
      </main>
    </div>
  )
}
