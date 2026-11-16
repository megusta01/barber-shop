import type { AuthTokens } from '@barbearia/shared'

const ACCESS_KEY = 'barbearia.accessToken'
const REFRESH_KEY = 'barbearia.refreshToken'

/** Evento disparado sempre que os tokens mudam nesta aba. */
export const TOKENS_CHANGED_EVENT = 'barbearia:tokens-changed'

const isBrowser = () => typeof window !== 'undefined'

export const tokenStorage = {
  getAccessToken(): string | null {
    return isBrowser() ? localStorage.getItem(ACCESS_KEY) : null
  },

  getRefreshToken(): string | null {
    return isBrowser() ? localStorage.getItem(REFRESH_KEY) : null
  },

  set(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken)
    window.dispatchEvent(new Event(TOKENS_CHANGED_EVENT))
  },

  clear(): void {
    if (!isBrowser()) return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    window.dispatchEvent(new Event(TOKENS_CHANGED_EVENT))
  },

  /** Chaves usadas para detectar login/logout em outras abas (evento `storage`). */
  keys: [ACCESS_KEY, REFRESH_KEY] as const,
}
