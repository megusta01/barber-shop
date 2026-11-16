'use client'

import type { AppointmentDto } from '@barbearia/shared'
import { ACTIVE_APPOINTMENT_STATUSES } from '@barbearia/shared'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCallback } from 'react'

import { Alert } from '@/components/ui/Alert'
import { buttonClass } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { AppointmentCard } from '@/features/appointments/AppointmentCard'
import { useAsync } from '@/hooks/useAsync'
import { appointmentsApi, availabilityApi } from '@/lib/api/endpoints'
import { useSession } from '@/lib/auth/AuthProvider'
import { formatDayLong, formatTime } from '@/lib/format'

function todayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { from: start.toISOString(), to: end.toISOString() }
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export default function BarberHomePage() {
  const { userId, name } = useSession()

  const load = useCallback(async () => {
    const [today, pending, availability] = await Promise.all([
      appointmentsApi.list({ ...todayRange(), order: 'asc', limit: 50 }),
      appointmentsApi.list({ from: new Date().toISOString(), status: 'pending', limit: 1 }),
      availabilityApi.get(userId),
    ])
    return {
      today: today.items,
      pendingCount: pending.total,
      freeSlots: availability.slots.filter((s) => !s.booked).length,
    }
  }, [userId])
  const { data, error, loading, setData } = useAsync(load)

  const replace = (updated: AppointmentDto) =>
    data && setData({ ...data, today: data.today.map((a) => (a.id === updated.id ? updated : a)) })

  const active = data?.today.filter((a) => ACTIVE_APPOINTMENT_STATUSES.includes(a.status)) ?? []
  const nextUp = active.find((a) => new Date(a.date).getTime() > Date.now() - 30 * 60_000)

  const stats = [
    { label: 'clientes hoje', value: active.length, href: '#hoje' },
    {
      label: 'aguardando confirmação',
      value: data?.pendingCount,
      href: '/dashboard/barber/appointments',
    },
    { label: 'horários livres', value: data?.freeSlots, href: '/dashboard/barber/availability' },
  ]

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${name.split(' ')[0]}`}
        description={formatDayLong(new Date().toISOString())}
        actions={
          <Link href="/dashboard/barber/availability" className={buttonClass('secondary')}>
            Abrir horários
          </Link>
        }
      />
      {error && <Alert className="mb-6">{error}</Alert>}

      <div className="mb-10 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-xl border border-line bg-white">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="px-3 py-4 transition-colors hover:bg-paper sm:px-6 sm:py-5"
          >
            <p className="font-display text-3xl font-semibold tabular-nums text-charcoal sm:text-4xl">
              {s.value ?? '–'}
            </p>
            <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
          </Link>
        ))}
      </div>

      <section id="hoje" aria-labelledby="hoje-title">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="hoje-title" className="font-display text-2xl font-semibold">
            Agenda de hoje
          </h2>
          {nextUp && (
            <p className="text-sm text-muted">
              Próximo às <span className="font-semibold text-ink">{formatTime(nextUp.date)}</span>
            </p>
          )}
        </div>

        {loading && !data && (
          <div className="space-y-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>
        )}

        {data && data.today.length === 0 && (
          <EmptyState
            icon={CalendarDaysIcon}
            title="Nenhum cliente hoje"
            action={
              <Link href="/dashboard/barber/availability" className={buttonClass('primary')}>
                Abrir horários
              </Link>
            }
          >
            Abra horários para os clientes conseguirem agendar com você.
          </EmptyState>
        )}

        {data && data.today.length > 0 && (
          <ul className="space-y-3">
            {data.today.map((a) => (
              <AppointmentCard
                key={a.id}
                appointment={a}
                viewer="barber"
                onChange={replace}
                hideDate
                highlight={a.id === nextUp?.id}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}
