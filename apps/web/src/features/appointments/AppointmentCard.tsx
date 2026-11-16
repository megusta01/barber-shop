'use client'

import {
  allowedStatuses,
  APPOINTMENT_STATUS_LABELS,
  AppointmentDto,
  AppointmentStatus,
  occupiesSlot,
  Role,
  SERVICE_LABELS,
} from '@barbearia/shared'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { inputBase } from '@/components/ui/Field'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { appointmentsApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatDateTime } from '@/lib/format'

interface Props {
  appointment: AppointmentDto
  viewer: Role
  onChange: (updated: AppointmentDto) => void
}

export function AppointmentCard({ appointment, viewer, onChange }: Props) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isClient = viewer === 'client'
  const isUpcoming = new Date(appointment.date).getTime() > Date.now()
  const statusOptions = allowedStatuses(viewer, appointment.status)

  async function save(changes: { status?: AppointmentStatus; isPaid?: boolean }) {
    setSaving(true)
    setError(null)
    try {
      onChange(await appointmentsApi.update(appointment.id, changes))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    if (window.confirm('Cancelar este agendamento? O horário volta a ficar livre.')) {
      void save({ status: AppointmentStatus.CANCELLED })
    }
  }

  return (
    <li className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-sm">
          <p className="font-semibold text-gray-900">{formatDateTime(appointment.date)}</p>
          <p className="text-gray-700">{SERVICE_LABELS[appointment.service]}</p>
          {viewer !== 'barber' && (
            <p className="text-gray-500">Barbeiro: {appointment.barber.displayName}</p>
          )}
          {viewer !== 'client' && (
            <p className="text-gray-500">Cliente: {appointment.customer.displayName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {appointment.isPaid && (
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
              Pago
            </span>
          )}
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      {isClient && isUpcoming && occupiesSlot(appointment.status) && (
        <div className="mt-3 flex justify-end">
          <Button variant="secondary" onClick={cancel} loading={saving}>
            Cancelar agendamento
          </Button>
        </div>
      )}

      {!isClient && (
        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-gray-600">Status</span>
            <select
              value={appointment.status}
              disabled={saving || statusOptions.length < 2}
              onChange={(e) => void save({ status: e.target.value as AppointmentStatus })}
              className={`${inputBase} py-1`}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {APPOINTMENT_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={appointment.isPaid}
              disabled={saving}
              onChange={(e) => void save({ isPaid: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Pago
          </label>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </li>
  )
}
