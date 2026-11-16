'use client'

import { useCallback } from 'react'

import { Alert } from '@/components/ui/Alert'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { AddSlotsForm } from '@/features/availability/AddSlotsForm'
import { SlotList } from '@/features/availability/SlotList'
import { useAsync } from '@/hooks/useAsync'
import { availabilityApi } from '@/lib/api/endpoints'
import { useSession } from '@/lib/auth/AuthProvider'

export default function AvailabilityPage() {
  const { userId } = useSession()
  const load = useCallback(() => availabilityApi.get(userId), [userId])
  const { data, error, loading, setData } = useAsync(load)

  return (
    <>
      <PageHeader title="Disponibilidade" description="Abra horários para os clientes agendarem." />
      <div className="grid gap-6 lg:grid-cols-[22rem,1fr]">
        <div>
          <AddSlotsForm barberId={userId} onAdded={setData} />
        </div>
        <div>
          {loading && !data && <Spinner />}
          {error && <Alert>{error}</Alert>}
          {data && <SlotList barberId={userId} availability={data} onChange={setData} />}
        </div>
      </div>
    </>
  )
}
