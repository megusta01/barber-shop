'use client'

import type { AppointmentDto, Paginated, Role } from '@barbearia/shared'
import { useCallback, useEffect, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { appointmentsApi, ListAppointmentsParams } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'

import { AppointmentCard } from './AppointmentCard'

type Tab = 'upcoming' | 'past'

const PAGE_SIZE = 20

const TABS: { id: Tab; label: string }[] = [
  { id: 'upcoming', label: 'Próximos' },
  { id: 'past', label: 'Histórico' },
]

function paramsFor(tab: Tab, page: number): ListAppointmentsParams {
  const now = new Date().toISOString()
  return tab === 'upcoming'
    ? { from: now, order: 'asc', page, limit: PAGE_SIZE }
    : { to: now, order: 'desc', page, limit: PAGE_SIZE }
}

/** Lista paginada de agendamentos com abas Próximos/Histórico. A API filtra pelo usuário logado. */
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

  return (
    <div className="space-y-4">
      <div role="tablist" className="inline-flex rounded-lg bg-gray-200/70 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <Alert>{error}</Alert>}

      {result && result.items.length === 0 && !loading && (
        <EmptyState
          title={tab === 'upcoming' ? 'Nenhum agendamento futuro.' : 'Nenhum agendamento anterior.'}
        />
      )}

      {result && result.items.length > 0 && (
        <ul className="space-y-3">
          {result.items.map((a) => (
            <AppointmentCard key={a.id} appointment={a} viewer={viewer} onChange={replace} />
          ))}
        </ul>
      )}

      {loading && !result && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

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
