'use client'

import type { AppointmentDto, BarberDto } from '@barbearia/shared'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { BarberPicker } from '@/features/booking/BarberPicker'
import { BookingModal } from '@/features/booking/BookingModal'
import { SlotPicker } from '@/features/booking/SlotPicker'
import { useAsync } from '@/hooks/useAsync'
import { availabilityApi, barbersApi } from '@/lib/api/endpoints'
import { formatDateTime } from '@/lib/format'

export default function BookingPage() {
  const [barber, setBarber] = useState<BarberDto | null>(null)
  const [pickedDate, setPickedDate] = useState<string | null>(null)
  const [booked, setBooked] = useState<AppointmentDto | null>(null)

  const loadBarbers = useCallback(() => barbersApi.list(), [])
  const barbers = useAsync(loadBarbers)

  const loadSlots = useMemo(() => (barber ? () => availabilityApi.get(barber.id) : null), [barber])
  const slots = useAsync(loadSlots)

  return (
    <>
      <PageHeader title="Agendar horário" description="Escolha o barbeiro e um horário livre." />

      {booked && (
        <div className="mb-6">
          <Alert tone="success">
            Agendado com {booked.barber.displayName} em {formatDateTime(booked.date)}.{' '}
            <Link href="/dashboard/client/appointments" className="font-medium underline">
              Ver meus agendamentos
            </Link>
          </Alert>
        </div>
      )}

      <div className="space-y-6">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">1. Barbeiro</h2>
          {barbers.loading && <Spinner />}
          {barbers.error && <Alert>{barbers.error}</Alert>}
          {barbers.data && (
            <BarberPicker
              barbers={barbers.data}
              selectedId={barber?.id ?? null}
              onSelect={(b) => {
                setBarber(b)
                setBooked(null)
              }}
            />
          )}
        </Card>

        {barber && (
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              2. Horário com {barber.displayName}
            </h2>
            {slots.loading && <Spinner />}
            {slots.error && <Alert>{slots.error}</Alert>}
            {slots.data && !slots.loading && (
              <SlotPicker slots={slots.data.slots} onPick={(s) => setPickedDate(s.date)} />
            )}
          </Card>
        )}
      </div>

      {barber && pickedDate && (
        <BookingModal
          barber={barber}
          date={pickedDate}
          onClose={() => setPickedDate(null)}
          onBooked={(appointment) => {
            setPickedDate(null)
            setBooked(appointment)
            void slots.reload()
          }}
          onError={() => void slots.reload()}
        />
      )}
    </>
  )
}
