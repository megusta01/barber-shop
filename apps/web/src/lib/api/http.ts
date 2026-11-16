import type { AuthTokens } from '@barbearia/shared'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { tokenStorage } from '../auth/token-storage'
import { API_URL } from '../env'

export const http = axios.create({ baseURL: API_URL })

http.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/** Um único refresh em andamento por vez; as requisições que falharem juntas esperam por ele. */
let refreshing: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  try {
    // axios "cru": não passa pelos interceptors, evitando loop
    const { data } = await axios.post<AuthTokens>(`${API_URL}/auth/refresh`, { refreshToken })
    tokenStorage.set(data)
    return data.accessToken
  } catch {
    tokenStorage.clear()
    return null
  }
}

export function refreshSession(): Promise<string | null> {
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null
  })
  return refreshing
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

http.interceptors.response.use(undefined, async (error: AxiosError) => {
  const original = error.config as RetriableConfig | undefined

  if (error.response?.status !== 401 || !original || original._retried) {
    throw error
  }

  original._retried = true
  const token = await refreshSession()
  if (!token) throw error

  original.headers.Authorization = `Bearer ${token}`
  return http(original)
})
