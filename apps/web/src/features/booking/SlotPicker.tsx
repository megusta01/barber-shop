import type { AvailabilitySlot } from '@barbearia/shared'

import { EmptyState } from '@/components/ui/EmptyState'
import { formatDayLong, formatTime, groupByDay } from '@/lib/format'

interface Props {
  slots: AvailabilitySlot[]
  onPick: (slot: AvailabilitySlot) => void
}

export function SlotPicker({ slots, onPick }: Props) {
  const free = slots.filter((s) => !s.booked)
  if (free.length === 0) {
    return (
      <EmptyState title="Este barbeiro não tem horários livres.">Tente outro barbeiro.</EmptyState>
    )
  }

  return (
    <div className="space-y-5">
      {groupByDay(slots, (s) => s.date).map(([day, daySlots]) => (
        <div key={day}>
          <h3 className="mb-2 text-sm font-medium text-gray-700">
            {formatDayLong(daySlots[0].date)}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {daySlots.map((slot) => (
              <li key={slot.date}>
                <button
                  type="button"
                  disabled={slot.booked}
                  onClick={() => onPick(slot)}
                  title={slot.booked ? 'Horário reservado' : undefined}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:line-through disabled:ring-gray-200"
                >
                  {formatTime(slot.date)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
