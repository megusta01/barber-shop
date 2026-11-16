'use client'

import type { AppointmentDto, Paginated, Role } from '@barbearia/shared'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button, buttonClass } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Spinner'
import { appointmentsApi, ListAppointmentsParams } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatRelativeDay, groupByDay } from '@/lib/format'

import { AppointmentCard } from './AppointmentCard'

type Tab = 'upcoming' | 'past'

const PAGE_SIZE = 20

const TABS: { id: Tab; label: string }[] = [
  { id: 'upcoming', label: 'Próximos' },
  { id: 'past', label: 'Anteriores' },
]

function paramsFor(tab: Tab, page: number): ListAppointmentsParams {
  const now = new Date().toISOString()
  return tab === 'upcoming'
    ? { from: now, order: 'asc', page, limit: PAGE_SIZE }
    : { to: now, order: 'desc', page, limit: PAGE_SIZE }
}

function emptyFor(viewer: Role, tab: Tab) {
  if (tab === 'past')
    return {
      title: 'Nada por aqui ainda',
      body: 'Os atendimentos que já passaram aparecem nesta aba.',
    }
  if (viewer === 'client')
    return {
      title: 'Você não tem horários marcados',
      body: 'Escolha um barbeiro e um horário livre.',
    }
  if (viewer === 'barber')
    return {
      title: 'Nenhum cliente agendado',
      body: 'Quando alguém reservar um dos seus horários, ele aparece aqui.',
    }
  return { title: 'Nenhum agendamento futuro', body: undefined }
}

/** Lista paginada de agendamentos, agrupada por dia. A API filtra pelo usuário logado. */
export function AppointmentsView({ viewer }: { viewer: Role }) {
  const [tab, setTab] = useState<Tab>('upcoming')
  const [result, setResult] = useState<Paginated<AppointmentDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (which: Tab, page: number) => {
    setLoading(true)
    setError(null)
    try {
      const next = await appointmentsApi.list(paramsFor(which, page))
      setResult((prev) =>
        page > 1 && prev ? { ...next, items: [...prev.items, ...next.items] } : next,
      )
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setResult(null)
    void load(tab, 1)
  }, [tab, load])

  const replace = (updated: AppointmentDto) =>
    setResult(
      (prev) =>
        prev && { ...prev, items: prev.items.map((a) => (a.id === updated.id ? updated : a)) },
    )

  const hasMore = result ? result.items.length < result.total : false
  const empty = emptyFor(viewer, tab)

  return (
    <div className="space-y-6">
      <div role="tablist" className="inline-flex rounded-lg border border-line bg-white p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-charcoal text-paper' : 'text-muted hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <Alert>{error}</Alert>}

      {loading && !result && (
        <div className="space-y-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      )}

      {result && result.items.length === 0 && !loading && (
        <EmptyState
          icon={CalendarDaysIcon}
          title={empty.title}
          action={
            viewer === 'client' && tab === 'upcoming' ? (
              <Link href="/dashboard/client" className={buttonClass('primary')}>
                Agendar horário
              </Link>
            ) : undefined
          }
        >
          {empty.body}
        </EmptyState>
      )}

      {result &&
        groupByDay(result.items, (a) => a.date).map(([day, items]) => (
          <section key={day} aria-label={formatRelativeDay(items[0].date)}>
            <h2 className="mb-3 text-sm font-semibold text-muted">
              {formatRelativeDay(items[0].date)}
            </h2>
            <ul className="space-y-3">
              {items.map((a) => (
                <AppointmentCard key={a.id} appointment={a} viewer={viewer} onChange={replace} />
              ))}
            </ul>
          </section>
        ))}

      {hasMore && result && (
        <div className="flex justify-center">
          <Button
            variant="secondary"
            loading={loading}
            onClick={() => void load(tab, result.page + 1)}
          >
            Carregar mais
          </Button>
        </div>
      )}
    </div>
  )
}
