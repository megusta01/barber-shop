'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { errorMessage } from '@/lib/api/errors'

interface AsyncState<T> {
  data: T | undefined
  error: string | null
  loading: boolean
  reload: () => Promise<void>
  setData: (data: T) => void
}

/**
 * Executa `load` ao montar e sempre que a função mudar (use `useCallback` no chamador).
 * Passe `null` para não carregar nada ainda.
 */
export function useAsync<T>(load: (() => Promise<T>) | null): AsyncState<T> {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(Boolean(load))
  // ignora respostas de cargas antigas que chegarem depois da mais recente
  const latest = useRef(0)

  const reload = useCallback(async () => {
    if (!load) return
    const id = ++latest.current
    setLoading(true)
    setError(null)
    try {
      const result = await load()
      if (id === latest.current) setData(result)
    } catch (err) {
      if (id === latest.current) setError(errorMessage(err))
    } finally {
      if (id === latest.current) setLoading(false)
    }
  }, [load])

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, error, loading, reload, setData }
}
