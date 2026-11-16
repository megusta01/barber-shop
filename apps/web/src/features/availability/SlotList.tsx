'use client'

import type { AvailabilityDto } from '@barbearia/shared'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { availabilityApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatDateTime, formatRelativeDay, formatTime, groupByDay } from '@/lib/format'

interface Props {
  barberId: string
  availability: AvailabilityDto
  onChange: (availability: AvailabilityDto) => void
}

export function SlotList({ barberId, availability, onChange }: Props) {
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function remove(key: string, dates: string[], question: string) {
    if (!window.confirm(question)) return
    setBusy(key)
    setError(null)
    try {
      onChange(await availabilityApi.remove(barberId, dates))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  const free = availability.slots.filter((s) => !s.booked).length
  const booked = availability.slots.length - free

  return (
    <Card>
      <CardTitle
        hint={
          availability.slots.length > 0
            ? `${free} livre${free === 1 ? '' : 's'} e ${booked} reservado${booked === 1 ? '' : 's'}. Horários reservados não podem ser removidos.`
            : undefined
        }
      >
        Seus próximos horários
      </CardTitle>

      {error && <Alert className="mb-4">{error}</Alert>}

      {availability.slots.length === 0 ? (
        <EmptyState icon={ClockIcon} title="Nenhum horário aberto">
          Abra horários ao lado para os clientes conseguirem agendar com você.
        </EmptyState>
      ) : (
        <div className="divide-y divide-line">
          {groupByDay(availability.slots, (s) => s.date).map(([day, slots]) => {
            const freeOfDay = slots.filter((s) => !s.booked).map((s) => s.date)
            return (
              <section key={day} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-2.5 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-ink">
                    {formatRelativeDay(slots[0].date)}
                  </h3>
                  {freeOfDay.length > 1 && (
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() =>
                        void remove(
                          day,
                          freeOfDay,
                          `Remover os ${freeOfDay.length} horários livres de ${formatRelativeDay(slots[0].date).toLowerCase()}?`,
                        )
                      }
                      className="rounded text-xs font-medium text-muted hover:text-red-700 disabled:opacity-50"
                    >
                      Remover livres do dia
                    </button>
                  )}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {slots.map((slot) =>
                    slot.booked ? (
                      <li
                        key={slot.date}
                        title="Reservado por um cliente"
                        className="inline-flex h-8 items-center rounded-full bg-charcoal px-3 text-sm font-semibold tabular-nums text-paper"
                      >
                        {formatTime(slot.date)}
                        <span className="ml-1.5 text-xs font-normal text-brass-200">reservado</span>
                      </li>
                    ) : (
                      <li
                        key={slot.date}
                        className="inline-flex h-8 items-center rounded-full border border-line bg-white pl-3 text-sm font-semibold tabular-nums text-ink"
                      >
                        {formatTime(slot.date)}
                        <button
                          type="button"
                          onClick={() =>
                            void remove(
                              slot.date,
                              [slot.date],
                              `Remover o horário ${formatDateTime(slot.date)}?`,
                            )
                          }
                          disabled={busy !== null}
                          aria-label={`Remover ${formatTime(slot.date)}`}
                          className="ml-1 mr-1 rounded-full p-1 text-muted hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                        >
                          <XMarkIcon className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </Card>
  )
}
