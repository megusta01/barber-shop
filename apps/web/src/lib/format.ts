const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const time = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' })
const longDay = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const shortWeekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Datas sempre no fuso do navegador, o mesmo usado pelo barbeiro ao cadastrar horários. */
export const formatDateTime = (iso: string) => dateTime.format(new Date(iso))
export const formatTime = (iso: string) => time.format(new Date(iso))
export const formatDayLong = (iso: string) => capitalize(longDay.format(new Date(iso)))
export const formatWeekdayShort = (iso: string) =>
  shortWeekday.format(new Date(iso)).replace('.', '')

/** Chave AAAA-MM-DD do dia local. */
export function dayKey(iso: string | Date): string {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** "Hoje", "Amanhã" ou "Terça-feira, 18 de novembro". */
export function formatRelativeDay(iso: string): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const key = dayKey(iso)
  if (key === dayKey(today)) return 'Hoje'
  if (key === dayKey(tomorrow)) return 'Amanhã'
  return formatDayLong(iso)
}

/** Agrupa itens pelo dia local (AAAA-MM-DD) preservando a ordem. */
export function groupByDay<T>(items: T[], getIso: (item: T) => string): [string, T[]][] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = dayKey(getIso(item))
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups.entries()]
}
