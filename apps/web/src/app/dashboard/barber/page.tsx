'use client'

import type { AppointmentDto } from '@barbearia/shared'
import Link from 'next/link'
import { useCallback } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { AppointmentCard } from '@/features/appointments/AppointmentCard'
import { useAsync } from '@/hooks/useAsync'
import { appointmentsApi, availabilityApi } from '@/lib/api/endpoints'
import { useSession } from '@/lib/auth/AuthProvider'

function todayRange() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { from: start.toISOString(), to: end.toISOString() }
}

function Stat({ label, value, href }: { label: string; value: number | undefined; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl bg-white p-5 ring-1 ring-gray-200 transition hover:ring-indigo-300"
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value ?? '–'}</p>
    </Link>
  )
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

  return (
    <>
      <PageHeader title={`Olá, ${name.split(' ')[0]}`} description="Resumo do seu dia." />
      {error && <Alert>{error}</Alert>}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat
          label="Atendimentos hoje"
          value={data?.today.length}
          href="/dashboard/barber/appointments"
        />
        <Stat
          label="Aguardando confirmação"
          value={data?.pendingCount}
          href="/dashboard/barber/appointments"
        />
        <Stat
          label="Horários livres"
          value={data?.freeSlots}
          href="/dashboard/barber/availability"
        />
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Hoje</h2>
        {loading && !data && <Spinner />}
        {data && data.today.length === 0 && (
          <EmptyState title="Nenhum atendimento hoje.">
            <Link href="/dashboard/barber/availability" className="font-medium text-indigo-600">
              Abrir horários
            </Link>
          </EmptyState>
        )}
        {data && data.today.length > 0 && (
          <ul className="space-y-3">
            {data.today.map((a) => (
              <AppointmentCard key={a.id} appointment={a} viewer="barber" onChange={replace} />
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
