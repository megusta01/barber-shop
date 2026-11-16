'use client'

import type { UserDto } from '@barbearia/shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
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
          welcome ? 'Confira seu nome e deixe um telefone para contato.' : 'Seus dados de contato.'
        }
      />
      <Card>
        {loading && <Spinner />}
        {error && <Alert>{error}</Alert>}
        {saved && (
          <div className="mb-4">
            <Alert tone="success">Perfil atualizado.</Alert>
          </div>
        )}
        {user && (
          <ProfileForm
            user={user}
            submitLabel={welcome ? 'Continuar' : 'Salvar'}
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
