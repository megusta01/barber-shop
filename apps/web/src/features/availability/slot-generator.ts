export interface SlotRange {
  /** Dias no formato AAAA-MM-DD */
  days: string[]
  /** HH:MM */
  start: string
  /** HH:MM; vazio = só o horário de início */
  end: string
  intervalMinutes: number
}

/** Gera os horários (ISO, fuso do navegador) de `start` até antes de `end`, em cada dia. */
export function generateSlots({ days, start, end, intervalMinutes }: SlotRange): string[] {
  if (!start) return []
  const slots: string[] = []
  for (const day of days) {
    const first = new Date(`${day}T${start}`)
    if (Number.isNaN(first.getTime())) continue
    if (!end) {
      slots.push(first.toISOString())
      continue
    }
    const last = new Date(`${day}T${end}`)
    for (let t = first.getTime(); t < last.getTime(); t += intervalMinutes * 60_000) {
      slots.push(new Date(t).toISOString())
    }
  }
  return slots
}
