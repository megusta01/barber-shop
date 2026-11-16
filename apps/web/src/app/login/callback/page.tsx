'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { FullPageSpinner } from '@/components/ui/Spinner'
import { useAuth } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

/** A API redireciona para cá com os tokens no fragmento: #access_token=…&refresh_token=…&first_login=0|1 */
export default function LoginCallbackPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (handled.current) return
    handled.current = true

    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    // tira os tokens da barra de endereço e do histórico
    window.history.replaceState(null, '', window.location.pathname)

    const session = accessToken && refreshToken ? signIn({ accessToken, refreshToken }) : null
    if (!session) {
      router.replace('/login?error=INVALID_TOKEN')
      return
    }

    router.replace(
      params.get('first_login') === '1'
        ? '/dashboard/profile?welcome=1'
        : homePathFor(session.role),
    )
  }, [signIn, router])

  return <FullPageSpinner />
}
