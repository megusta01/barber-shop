'use client'

import type { Role } from '@barbearia/shared'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { FullPageSpinner } from '@/components/ui/Spinner'

import { useAuth } from './AuthProvider'
import { homePathFor } from './session'

interface Props {
  /** Papéis aceitos. Sem a prop, basta estar logado. */
  roles?: Role[]
  children: ReactNode
}

/**
 * Proteção de rota no cliente: manda para o login quem não está logado e para a própria
 * área quem não tem o papel. A API faz a checagem de verdade; isto só evita telas quebradas.
 */
export function RequireRole({ roles, children }: Props) {
  const { status, session } = useAuth()
  const router = useRouter()
  const allowed = Boolean(session && (!roles || roles.includes(session.role)))

  useEffect(() => {
    if (status === 'anonymous') router.replace('/login')
    else if (status === 'authenticated' && session && !allowed) {
      router.replace(homePathFor(session.role))
    }
  }, [status, session, allowed, router])

  if (!allowed) return <FullPageSpinner />
  return <>{children}</>
}
