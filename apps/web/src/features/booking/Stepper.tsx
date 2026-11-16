import { CheckIcon } from '@heroicons/react/20/solid'

const STEPS = ['Barbeiro', 'Horário', 'Serviço']

/** Indicador das três etapas do agendamento. `current` começa em 0. */
export function Stepper({ current }: { current: number }) {
  return (
    <ol className="mb-8 flex items-center gap-2 text-sm" aria-label="Etapas do agendamento">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-hidden
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                done
                  ? 'bg-brass-500 text-charcoal'
                  : active
                    ? 'bg-charcoal text-paper'
                    : 'border border-line bg-white text-muted'
              }`}
            >
              {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
            </span>
            <span
              aria-current={active ? 'step' : undefined}
              className={active ? 'font-semibold text-charcoal' : 'text-muted'}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span aria-hidden className="mx-1 h-px w-6 bg-line sm:w-10" />}
          </li>
        )
      })}
    </ol>
  )
}
