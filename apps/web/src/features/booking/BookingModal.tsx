'use client'

import {
  AppointmentDto,
  BarberDto,
  SERVICE_LABELS,
  SERVICE_TYPES,
  ServiceType,
} from '@barbearia/shared'
import { FormEvent, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { appointmentsApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatRelativeDay, formatTime } from '@/lib/format'

const SERVICE_HINTS: Record<ServiceType, string> = {
  haircut: 'Só o cabelo',
  shave: 'Barba feita na navalha',
  'haircut and shave': 'Cabelo e barba no mesmo horário',
  'beard trim': 'Acerto e contorno da barba',
}

interface Props {
  barber: BarberDto
  date: string
  onClose: () => void
  onBooked: (appointment: AppointmentDto) => void
  /** Chamado quando a reserva falha (ex.: horário pego por outra pessoa), para recarregar a lista. */
  onError: () => void
}

export function BookingModal({ barber, date, onClose, onBooked, onError }: Props) {
  const [service, setService] = useState<ServiceType | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!service) return
    setSaving(true)
    setError(null)
    try {
      onBooked(await appointmentsApi.create({ barberId: barber.id, date, service }))
    } catch (err) {
      setError(errorMessage(err))
      onError()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Qual serviço?" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl bg-paper p-3">
          <Avatar name={barber.displayName} src={barber.avatarUrl} size={40} />
          <div className="text-sm">
            <p className="font-semibold text-charcoal">{barber.displayName}</p>
            <p className="text-muted">
              {formatRelativeDay(date)}, às {formatTime(date)}
            </p>
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">Serviço</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {SERVICE_TYPES.map((s) => {
              const checked = service === s
              return (
                <label
                  key={s}
                  className={`flex cursor-pointer flex-col rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass-500 ${
                    checked
                      ? 'border-brass-500 bg-brass-50 ring-1 ring-brass-500'
                      : 'border-line bg-white hover:border-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s}
                    checked={checked}
                    onChange={() => setService(s)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-charcoal">{SERVICE_LABELS[s]}</span>
                  <span className="text-sm text-muted">{SERVICE_HINTS[s]}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {error && <Alert>{error}</Alert>}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Voltar
          </Button>
          <Button type="submit" loading={saving} disabled={!service}>
            Confirmar agendamento
          </Button>
        </div>
      </form>
    </Modal>
  )
}
