const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })
const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' })

const clean = (s: string) => s.replace('.', '')

/**
 * "Canhoto" de data: dia em serifa grande, dia da semana e mês pequenos.
 * É a marca visual dos agendamentos em todo o app.
 */
export function DateStub({ iso, muted = false }: { iso: string; muted?: boolean }) {
  const d = new Date(iso)
  return (
    <div
      className={`flex w-16 shrink-0 flex-col items-center justify-center border-r border-dashed py-1 pr-4 leading-none ${
        muted ? 'border-line text-muted' : 'border-brass-200 text-charcoal'
      }`}
    >
      <span className="text-xs font-medium capitalize text-muted">{clean(weekday.format(d))}</span>
      <span className="font-display text-3xl font-semibold tabular-nums">{d.getDate()}</span>
      <span className="text-xs font-medium capitalize text-muted">{clean(month.format(d))}</span>
    </div>
  )
}
