'use client'

import type { AvailabilitySlot } from '@barbearia/shared'
import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'

import { EmptyState } from '@/components/ui/EmptyState'
import { formatRelativeDay, formatTime, formatWeekdayShort, groupByDay } from '@/lib/format'

interface Props {
  slots: AvailabilitySlot[]
  selected: string | null
  onPick: (slot: AvailabilitySlot) => void
}

/** Faixa de dias no topo e os horários do dia escolhido embaixo. */
export function DayTimePicker({ slots, selected, onPick }: Props) {
  const days = useMemo(() => groupByDay(slots, (s) => s.date), [slots])
  const firstWithFree = days.find(([, daySlots]) => daySlots.some((s) => !s.booked))?.[0]
  const [chosenDay, setChosenDay] = useState<string | null>(null)
  const activeDay = chosenDay && days.some(([k]) => k === chosenDay) ? chosenDay : firstWithFree

  if (!firstWithFree) {
    return (
      <EmptyState icon={CalendarDaysIcon} title="Sem horários livres com este barbeiro">
        Escolha outro barbeiro ou volte mais tarde: novos horários aparecem aqui assim que forem
        abertos.
      </EmptyState>
    )
  }

  const daySlots = days.find(([k]) => k === activeDay)?.[1] ?? []

  return (
    <div>
      <div
        role="tablist"
        aria-label="Dias disponíveis"
        className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2"
      >
        {days.map(([key, list]) => {
          const free = list.filter((s) => !s.booked).length
          const active = key === activeDay
          const d = new Date(list[0].date)
          return (
            <button
              key={key}
              role="tab"
              type="button"
              aria-selected={active}
              disabled={free === 0}
              onClick={() => setChosenDay(key)}
              className={`flex w-[4.5rem] shrink-0 snap-start flex-col items-center rounded-xl border px-2 py-2.5 leading-none transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? 'border-charcoal bg-charcoal text-paper'
                  : 'border-line bg-white text-ink hover:border-muted/50'
              }`}
            >
              <span className={`text-xs capitalize ${active ? 'text-stone-300' : 'text-muted'}`}>
                {formatWeekdayShort(list[0].date)}
              </span>
              <span className="my-1 font-display text-2xl font-semibold tabular-nums">
                {d.getDate()}
              </span>
              <span className={`text-[11px] ${active ? 'text-brass-200' : 'text-brass-700'}`}>
                {free === 0 ? 'lotado' : `${free} livre${free > 1 ? 's' : ''}`}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mb-3 mt-5 text-sm font-semibold text-ink">
        {formatRelativeDay(daySlots[0]?.date ?? '')}
      </p>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
        {daySlots.map((slot) => {
          const isSelected = slot.date === selected
          return (
            <li key={slot.date}>
              <button
                type="button"
                disabled={slot.booked}
                onClick={() => onPick(slot)}
                aria-pressed={isSelected}
                aria-label={
                  slot.booked
                    ? `${formatTime(slot.date)}, reservado`
                    : `Agendar às ${formatTime(slot.date)}`
                }
                className={`h-11 w-full rounded-full border text-sm font-semibold tabular-nums transition-colors disabled:cursor-not-allowed disabled:border-transparent disabled:bg-line/40 disabled:text-muted/60 disabled:line-through ${
                  isSelected
                    ? 'border-brass-500 bg-brass-500 text-charcoal'
                    : 'border-line bg-white text-charcoal hover:border-brass-500 hover:bg-brass-50'
                }`}
              >
                {formatTime(slot.date)}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
