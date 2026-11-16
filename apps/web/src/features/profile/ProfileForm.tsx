'use client'

import type { UserDto } from '@barbearia/shared'
import { FormEvent, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Field, inputClass } from '@/components/ui/Field'
import { usersApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'

/** Mesmo formato aceito pela API; escapado para o modo `v` de regex usado pelo atributo pattern. */
const PHONE_PATTERN = String.raw`[0-9\s\(\)\+\-]{8,20}`

interface Props {
  user: UserDto
  submitLabel: string
  onSaved: (user: UserDto) => void
}

export function ProfileForm({ user, submitLabel, onSaved }: Props) {
  const [displayName, setDisplayName] = useState(user.displayName)
  const [phone, setPhone] = useState(user.phone)
  const [description, setDescription] = useState(user.description)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      onSaved(
        await usersApi.updateMe({
          displayName: displayName.trim(),
          // campos vazios não são enviados (a API valida o formato quando presentes)
          ...(phone.trim() && { phone: phone.trim() }),
          description: description.trim(),
        }),
      )
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-4 border-b border-line pb-6">
        <Avatar name={user.displayName} src={user.avatarUrl} size={56} />
        <div className="text-sm">
          <p className="font-semibold text-ink">{user.email}</p>
          <p className="text-muted">Foto e e-mail vêm da sua conta Google.</p>
        </div>
      </div>

      <Field label="Nome">
        {(id) => (
          <input
            id={id}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
            className={inputClass}
          />
        )}
      </Field>

      <Field label="Telefone (WhatsApp)" hint="Com DDD. Usado pela barbearia para falar com você.">
        {(id) => (
          <input
            id={id}
            type="tel"
            inputMode="tel"
            placeholder="(11) 91234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            pattern={PHONE_PATTERN}
            className={inputClass}
          />
        )}
      </Field>

      {user.role === 'barber' && (
        <Field
          label="Sobre você"
          hint="Aparece para os clientes na hora de escolher o barbeiro. Ex.: especialidades e tempo de casa."
        >
          {(id) => (
            <textarea
              id={id}
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} h-auto py-2`}
            />
          )}
        </Field>
      )}

      {error && <Alert>{error}</Alert>}

      <Button type="submit" size="lg" loading={saving}>
        {submitLabel}
      </Button>
    </form>
  )
}
