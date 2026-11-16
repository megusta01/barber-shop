'use client'

import type { AvailabilityDto } from '@barbearia/shared'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { availabilityApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { formatDateTime, formatDayLong, formatTime, groupByDay } from '@/lib/format'

interface Props {
  barberId: string
  availability: AvailabilityDto
  onChange: (availability: AvailabilityDto) => void
}

export function SlotList({ barberId, availability, onChange }: Props) {
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function remove(date: string) {
    if (!window.confirm(`Remover o horário ${formatDateTime(date)}?`)) return
    setRemoving(date)
    setError(null)
    try {
      onChange(await availabilityApi.remove(barberId, [date]))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setRemoving(null)
    }
  }

  return (
    <Card>
      <h2 className="mb-1 text-lg font-semibold text-gray-900">Seus horários</h2>
      <p className="mb-4 text-sm text-gray-500">
        Horários reservados aparecem em destaque e não podem ser removidos.
      </p>

      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}

      {availability.slots.length === 0 ? (
        <EmptyState title="Você ainda não tem horários futuros." />
      ) : (
        <div className="space-y-5">
          {groupByDay(availability.slots, (s) => s.date).map(([day, slots]) => (
            <div key={day}>
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                {formatDayLong(slots[0].date)}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <li
                    key={slot.date}
                    className={`inline-flex items-center gap-1 rounded-md py-1 pl-3 pr-1 text-sm ring-1 ${
                      slot.booked
                        ? 'bg-indigo-600 pr-3 text-white ring-indigo-600'
                        : 'bg-white text-gray-800 ring-gray-200'
                    }`}
                  >
                    {formatTime(slot.date)}
                    {!slot.booked && (
                      <button
                        type="button"
                        onClick={() => void remove(slot.date)}
                        disabled={removing === slot.date}
                        aria-label={`Remover ${formatTime(slot.date)}`}
                        className="rounded p-0.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
