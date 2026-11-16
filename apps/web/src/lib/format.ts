const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const time = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' })
const longDay = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

/** Datas sempre no fuso do navegador, o mesmo usado pelo barbeiro ao cadastrar horários. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
export const formatTime = (iso: string) => time.format(new Date(iso))
export const formatDayLong = (iso: string) => {
  const text = longDay.format(new Date(iso))
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** Agrupa itens pelo dia local (AAAA-MM-DD) preservando a ordem. */
export function groupByDay<T>(items: T[], getIso: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const d = new Date(getIso(item))
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups.entries()]
}
