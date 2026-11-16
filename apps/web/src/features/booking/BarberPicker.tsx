import type { BarberDto } from '@barbearia/shared'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { ScissorsIcon } from '@heroicons/react/24/outline'

import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  barbers: BarberDto[]
  selectedId: string | null
  onSelect: (barber: BarberDto) => void
}

export function BarberPicker({ barbers, selectedId, onSelect }: Props) {
  if (barbers.length === 0) {
    return (
      <EmptyState icon={ScissorsIcon} title="Nenhum barbeiro atendendo agora">
        Assim que a barbearia cadastrar os barbeiros, eles aparecem aqui.
      </EmptyState>
    )
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
              className={`relative flex h-full w-full items-start gap-4 rounded-xl border bg-white p-4 text-left transition-colors ${
                selected
                  ? 'border-brass-500 ring-1 ring-brass-500'
                  : 'border-line hover:border-muted/50'
              }`}
            >
              <Avatar name={barber.displayName} src={barber.avatarUrl} size={48} />
              <span className="min-w-0 pr-6">
                <span className="block font-semibold text-charcoal">{barber.displayName}</span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-muted">
                  {barber.description || 'Barbeiro da casa'}
                </span>
              </span>
              {selected && (
                <CheckCircleIcon
                  className="absolute right-3 top-3 h-5 w-5 text-brass-500"
                  aria-hidden
                />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
