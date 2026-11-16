import type { BarberDto } from '@barbearia/shared'

import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  barbers: BarberDto[]
  selectedId: string | null
  onSelect: (barber: BarberDto) => void
}

export function BarberPicker({ barbers, selectedId, onSelect }: Props) {
  if (barbers.length === 0) {
    return <EmptyState title="Nenhum barbeiro disponível no momento." />
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {barbers.map((barber) => {
        const selected = barber.id === selectedId
        return (
          <li key={barber.id}>
            <button
              type="button"
              onClick={() => onSelect(barber)}
              aria-pressed={selected}
              className={`flex w-full items-start gap-3 rounded-lg p-4 text-left ring-1 transition ${
                selected
                  ? 'bg-indigo-50 ring-2 ring-indigo-500'
                  : 'bg-white ring-gray-200 hover:ring-indigo-300'
              }`}
            >
              <Avatar name={barber.displayName} src={barber.avatarUrl} />
              <span>
                <span className="block font-medium text-gray-900">{barber.displayName}</span>
                {barber.description && (
                  <span className="mt-0.5 line-clamp-2 block text-xs text-gray-500">
                    {barber.description}
                  </span>
                )}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
