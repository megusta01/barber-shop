'use client'

import { ACTIVE_APPOINTMENT_STATUSES, SERVICE_LABELS } from '@barbearia/shared'
import Link from 'next/link'
import { useCallback } from 'react'

import { DateStub } from '@/components/ui/DateStub'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useAsync } from '@/hooks/useAsync'
import { appointmentsApi } from '@/lib/api/endpoints'
import { formatTime } from '@/lib/format'

/** Lembrete do próximo horário do cliente no topo da tela de agendamento. */
export function NextAppointment({ refreshKey }: { refreshKey: number }) {
  const load = useCallback(
    () => appointmentsApi.list({ from: new Date().toISOString(), order: 'asc', limit: 10 }),
    // refreshKey força recarregar depois de um novo agendamento
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refreshKey],
  )
  const { data } = useAsync(load)
  const next = data?.items.find((a) => ACTIVE_APPOINTMENT_STATUSES.includes(a.status))
  if (!next) return null

  return (
    <Link
      href="/dashboard/client/appointments"
      className="mb-8 flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition-colors hover:border-muted/50"
    >
      <DateStub iso={next.date} />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted">Seu próximo horário</p>
        <p className="line-clamp-2 font-semibold text-charcoal">
          {SERVICE_LABELS[next.service]} às {formatTime(next.date)} com {next.barber.displayName}
        </p>
      </div>
      <StatusBadge status={next.status} />
    </Link>
  )
}
