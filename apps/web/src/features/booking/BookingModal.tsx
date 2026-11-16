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
import { Button } from '@/components/ui/Button'
import { Field, inputClass } from '@/components/ui/Field'
import { Modal } from '@/components/ui/Modal'
import { appointmentsApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatDayLong, formatTime } from '@/lib/format'

interface Props {
  barber: BarberDto
  date: string
  onClose: () => void
  onBooked: (appointment: AppointmentDto) => void
  /** Chamado quando a reserva falha (ex.: horário pego por outra pessoa), para recarregar a lista. */
  onError: () => void
}

export function BookingModal({ barber, date, onClose, onBooked, onError }: Props) {
  const [service, setService] = useState<ServiceType>(SERVICE_TYPES[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
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
    <Modal title="Confirmar agendamento" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-gray-500">Barbeiro</dt>
          <dd className="font-medium text-gray-900">{barber.displayName}</dd>
          <dt className="text-gray-500">Quando</dt>
          <dd className="font-medium text-gray-900">
            {formatDayLong(date)}, às {formatTime(date)}
          </dd>
        </dl>

        <Field label="Serviço">
          {(id) => (
            <select
              id={id}
              value={service}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className={inputClass}
            >
              {SERVICE_TYPES.map((s) => (
                <option key={s} value={s}>
                  {SERVICE_LABELS[s]}
                </option>
              ))}
            </select>
          )}
        </Field>

        {error && <Alert>{error}</Alert>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            Confirmar
          </Button>
        </div>
      </form>
    </Modal>
  )
}
