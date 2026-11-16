'use client'

import type { AuthTokens } from '@barbearia/shared'
import { useRouter } from 'next/navigation'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { refreshSession } from '../api/http'
import { Session, sessionFromToken } from './session'
import { TOKENS_CHANGED_EVENT, tokenStorage } from './token-storage'

type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  signIn: (tokens: AuthTokens) => Session | null
  signOut: () => void
  /** Pede tokens novos à API (ex.: depois de mudar o nome no perfil). */
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [session, setSession] = useState<Session | null>(null)

  const sync = useCallback(() => {
    const next = sessionFromToken(tokenStorage.getAccessToken())
    setSession(next)
    setStatus(next ? 'authenticated' : 'anonymous')
  }, [])

  useEffect(() => {
    // só há access token salvo se o usuário já entrou; sem ele, tenta recuperar pelo refresh
    if (!tokenStorage.getAccessToken() && tokenStorage.getRefreshToken()) {
      void refreshSession().finally(sync)
    } else {
      sync()
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === null || (tokenStorage.keys as readonly string[]).includes(e.key)) sync()
    }
    window.addEventListener(TOKENS_CHANGED_EVENT, sync)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(TOKENS_CHANGED_EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [sync])

  const signIn = useCallback((tokens: AuthTokens) => {
    tokenStorage.set(tokens)
    return sessionFromToken(tokens.accessToken)
  }, [])

  const signOut = useCallback(() => {
    tokenStorage.clear()
    router.replace('/login')
  }, [router])

  const refresh = useCallback(async () => {
    await refreshSession()
  }, [])

  const value = useMemo(
    () => ({ status, session, signIn, signOut, refresh }),
    [status, session, signIn, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  return ctx
}

/** Atalho para páginas que só renderizam com usuário logado (dentro de RequireRole). */
export function useSession(): Session {
  const { session } = useAuth()
  if (!session) throw new Error('useSession usado fora de uma rota protegida')
  return session
}
