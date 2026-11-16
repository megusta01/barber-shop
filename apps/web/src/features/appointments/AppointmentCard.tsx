'use client'

import {
  allowedStatuses,
  AppointmentDto,
  AppointmentStatus,
  occupiesSlot,
  Role,
  SERVICE_LABELS,
} from '@barbearia/shared'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { DateStub } from '@/components/ui/DateStub'
import { PaidBadge, StatusBadge } from '@/components/ui/StatusBadge'
import { appointmentsApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatTime } from '@/lib/format'

/** Rótulo de cada ação de status, do ponto de vista de quem clica. */
const ACTIONS: Partial<Record<AppointmentStatus, string>> = {
  confirmed: 'Confirmar',
  completed: 'Concluir',
  cancelled: 'Cancelar',
}

const CONFIRM_CANCEL: Record<Role, string> = {
  client: 'Cancelar este agendamento? O horário fica livre para outra pessoa.',
  barber: 'Cancelar este atendimento? O cliente verá o agendamento como cancelado.',
  admin: 'Cancelar este agendamento?',
}

interface Props {
  appointment: AppointmentDto
  viewer: Role
  onChange: (updated: AppointmentDto) => void
  /** Esconde o canhoto de data (listas de um único dia). */
  hideDate?: boolean
  /** Destaca o card como o próximo atendimento. */
  highlight?: boolean
}

export function AppointmentCard({ appointment, viewer, onChange, hideDate, highlight }: Props) {
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isClient = viewer === 'client'
  const isUpcoming = new Date(appointment.date).getTime() > Date.now()
  const finished = !occupiesSlot(appointment.status)
  const nextStatuses = allowedStatuses(viewer, appointment.status).filter(
    (s) => s !== appointment.status,
  )
  // a pessoa do outro lado do agendamento
  const other = viewer === 'barber' ? appointment.customer : appointment.barber

  async function save(key: string, changes: { status?: AppointmentStatus; isPaid?: boolean }) {
    if (changes.status === 'cancelled' && !window.confirm(CONFIRM_CANCEL[viewer])) return
    setSaving(key)
    setError(null)
    try {
      onChange(await appointmentsApi.update(appointment.id, changes))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(null)
    }
  }

  const showClientCancel = isClient && isUpcoming && !finished
  const showStaffActions =
    !isClient && (nextStatuses.length > 0 || appointment.status !== 'cancelled')

  return (
    <li
      className={`rounded-xl border bg-white p-4 sm:p-5 ${
        highlight
          ? 'border-brass-500 ring-1 ring-brass-500'
          : finished
            ? 'border-line/70'
            : 'border-line'
      }`}
    >
      {highlight && <p className="mb-3 text-sm font-semibold text-brass-700">Próximo cliente</p>}
      <div className="flex gap-4">
        {!hideDate && <DateStub iso={appointment.date} muted={finished} />}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <p
              className={`font-display text-2xl font-semibold tabular-nums leading-none ${
                appointment.status === 'cancelled' ? 'text-muted line-through' : 'text-charcoal'
              }`}
            >
              {formatTime(appointment.date)}
            </p>
            <div className="flex items-center gap-1.5">
              {appointment.isPaid && <PaidBadge />}
              <StatusBadge status={appointment.status} />
            </div>
          </div>
          <p className="mt-2 font-semibold text-ink">{SERVICE_LABELS[appointment.service]}</p>
          <div className="mt-0.5 text-sm text-muted">
            <span>
              {viewer === 'barber' && other.displayName}
              {viewer === 'client' && `com ${other.displayName}`}
              {viewer === 'admin' &&
                `${appointment.customer.displayName} com ${appointment.barber.displayName}`}
            </span>
          </div>
        </div>
      </div>

      {(showClientCancel || showStaffActions) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-dashed border-line pt-4">
          {showClientCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="-ml-3 text-red-700 hover:bg-red-50"
              loading={saving === 'cancelled'}
              onClick={() => void save('cancelled', { status: 'cancelled' })}
            >
              Cancelar agendamento
            </Button>
          )}

          {!isClient &&
            nextStatuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={
                  s === 'cancelled' ? 'danger' : s === nextStatuses[0] ? 'primary' : 'secondary'
                }
                loading={saving === s}
                disabled={saving !== null}
                onClick={() => void save(s, { status: s })}
              >
                {ACTIONS[s]}
              </Button>
            ))}

          {!isClient && appointment.status !== 'cancelled' && (
            <button
              type="button"
              aria-pressed={appointment.isPaid}
              disabled={saving !== null}
              onClick={() => void save('paid', { isPaid: !appointment.isPaid })}
              className={`ml-auto inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition-colors disabled:opacity-50 ${
                appointment.isPaid
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'text-muted hover:bg-charcoal/5 hover:text-ink'
              }`}
            >
              <span
                aria-hidden
                className={`flex h-4 w-4 items-center justify-center rounded border ${
                  appointment.isPaid
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-muted'
                }`}
              >
                {appointment.isPaid && <CheckIcon className="h-3 w-3" />}
              </span>
              Pago
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </li>
  )
}
