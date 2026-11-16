'use client'

import type { UserDto } from '@barbearia/shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { ProfileForm } from '@/features/profile/ProfileForm'
import { useAsync } from '@/hooks/useAsync'
import { usersApi } from '@/lib/api/endpoints'
import { useAuth } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

function ProfileContent() {
  const welcome = useSearchParams().get('welcome') === '1'
  const router = useRouter()
  const { refresh } = useAuth()
  const [saved, setSaved] = useState(false)
  const load = useCallback(() => usersApi.me(), [])
  const { data: user, error, loading, setData } = useAsync(load)

  async function handleSaved(updated: UserDto) {
    setData(updated)
    // novo token para o nome atualizado aparecer no cabeçalho
    await refresh()
    if (welcome) router.replace(homePathFor(updated.role))
    else setSaved(true)
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title={welcome ? 'Complete seu cadastro' : 'Seu perfil'}
        description={
          welcome
            ? 'Confira seu nome e deixe um telefone para a barbearia falar com você.'
            : 'Como a barbearia vê você e fala com você.'
        }
      />
      <Card>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-14" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        )}
        {error && <Alert>{error}</Alert>}
        {saved && (
          <Alert tone="success" className="mb-6">
            Perfil salvo.
          </Alert>
        )}
        {user && (
          <ProfileForm
            user={user}
            submitLabel={welcome ? 'Salvar e continuar' : 'Salvar perfil'}
            onSaved={(u) => void handleSaved(u)}
          />
        )}
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  )
}
