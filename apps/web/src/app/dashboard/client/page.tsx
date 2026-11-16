'use client'

import type { AppointmentDto, BarberDto } from '@barbearia/shared'
import { SERVICE_LABELS } from '@barbearia/shared'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button, buttonClass } from '@/components/ui/Button'
import { Card, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Skeleton } from '@/components/ui/Spinner'
import { BarberPicker } from '@/features/booking/BarberPicker'
import { BookingModal } from '@/features/booking/BookingModal'
import { DayTimePicker } from '@/features/booking/DayTimePicker'
import { NextAppointment } from '@/features/booking/NextAppointment'
import { Stepper } from '@/features/booking/Stepper'
import { useAsync } from '@/hooks/useAsync'
import { availabilityApi, barbersApi } from '@/lib/api/endpoints'
import { formatRelativeDay, formatTime } from '@/lib/format'

function Booked({ appointment, onAgain }: { appointment: AppointmentDto; onAgain: () => void }) {
  return (
    <Card className="animate-rise-in text-center">
      <CheckCircleIcon className="mx-auto h-12 w-12 text-brass-500" aria-hidden />
      <h2 className="mt-3 font-display text-3xl font-semibold">Horário agendado</h2>
      <p className="mx-auto mt-2 max-w-sm text-muted">
        {SERVICE_LABELS[appointment.service]} com {appointment.barber.displayName},{' '}
        {formatRelativeDay(appointment.date).toLowerCase()} às {formatTime(appointment.date)}. O
        barbeiro já recebeu o seu agendamento.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/dashboard/client/appointments" className={buttonClass('primary')}>
          Ver meus agendamentos
        </Link>
        <Button variant="secondary" onClick={onAgain}>
          Agendar outro horário
        </Button>
      </div>
    </Card>
  )
}

export default function BookingPage() {
  const [barber, setBarber] = useState<BarberDto | null>(null)
  const [pickedDate, setPickedDate] = useState<string | null>(null)
  const [booked, setBooked] = useState<AppointmentDto | null>(null)
  const [bookings, setBookings] = useState(0)

  const loadBarbers = useCallback(() => barbersApi.list(), [])
  const barbers = useAsync(loadBarbers)

  const loadSlots = useMemo(() => (barber ? () => availabilityApi.get(barber.id) : null), [barber])
  const slots = useAsync(loadSlots)

  const step = pickedDate ? 2 : barber ? 1 : 0

  return (
    <>
      <PageHeader title="Agendar horário" />
      <NextAppointment refreshKey={bookings} />

      {booked ? (
        <Booked
          appointment={booked}
          onAgain={() => {
            setBooked(null)
            setBarber(null)
          }}
        />
      ) : (
        <>
          <Stepper current={step} />
          <div className="space-y-6">
            <Card>
              <CardTitle hint="Toque no barbeiro para ver os horários dele.">
                Com quem você quer cortar?
              </CardTitle>
              {barbers.loading && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              )}
              {barbers.error && <Alert>{barbers.error}</Alert>}
              {barbers.data && (
                <BarberPicker
                  barbers={barbers.data}
                  selectedId={barber?.id ?? null}
                  onSelect={setBarber}
                />
              )}
            </Card>

            {barber && (
              <Card className="animate-rise-in">
                <CardTitle hint="Horários riscados já foram reservados.">
                  Horários de {barber.displayName.split(' ')[0]}
                </CardTitle>
                {slots.loading && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-[4.75rem] w-[4.5rem]" />
                      ))}
                    </div>
                    <Skeleton className="h-11" />
                  </div>
                )}
                {slots.error && <Alert>{slots.error}</Alert>}
                {slots.data && !slots.loading && (
                  <DayTimePicker
                    slots={slots.data.slots}
                    selected={pickedDate}
                    onPick={(s) => setPickedDate(s.date)}
                  />
                )}
              </Card>
            )}
          </div>
        </>
      )}

      {barber && pickedDate && (
        <BookingModal
          barber={barber}
          date={pickedDate}
          onClose={() => setPickedDate(null)}
          onBooked={(appointment) => {
            setPickedDate(null)
            setBooked(appointment)
            setBookings((n) => n + 1)
            void slots.reload()
          }}
          onError={() => void slots.reload()}
        />
      )}
    </>
  )
}
