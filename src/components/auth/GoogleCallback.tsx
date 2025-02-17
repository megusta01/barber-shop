'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const displayName = searchParams.get('display_name')
    const isFirstLogin = searchParams.get('is_first_login')
    const role = searchParams.get('role') || 'client'

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      if (displayName) localStorage.setItem('displayName', displayName)
      localStorage.setItem('role', role)
    } else {
      router.push('/login?error=missing_tokens')
      return
    }

    if (isFirstLogin === 'true') {
      router.push('/complete-profile')
      return
    }

    switch (role) {
      case 'admin':
        router.push('/dashboard/admin')
        break
      case 'barber':
        router.push('/dashboard/barber')
        break
      default:
        router.push('/dashboard/client')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Autenticando...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  )
}