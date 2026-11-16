'use client'

import { useCallback } from 'react'

import { Alert } from '@/components/ui/Alert'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
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
      <PageHeader
        title="Meus horários"
        description="Os horários abertos aqui são os que os clientes podem reservar."
      />
      <div className="grid items-start gap-6 lg:grid-cols-[24rem_1fr]">
        <AddSlotsForm barberId={userId} onAdded={setData} />
        <div>
          {loading && !data && <Skeleton className="h-64" />}
          {error && <Alert>{error}</Alert>}
          {data && <SlotList barberId={userId} availability={data} onChange={setData} />}
        </div>
      </div>
    </>
  )
}
