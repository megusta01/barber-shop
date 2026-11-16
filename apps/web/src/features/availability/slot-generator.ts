export interface SlotRange {
  /** AAAA-MM-DD */
  day: string
  /** HH:MM */
  start: string
  /** HH:MM; vazio = só o horário de início */
  end: string
  intervalMinutes: number
}

/** Gera os horários (ISO, fuso do navegador) de `start` até antes de `end`, a cada intervalo. */
export function generateSlots({ day, start, end, intervalMinutes }: SlotRange): string[] {
  if (!day || !start) return []
  const first = new Date(`${day}T${start}`)
  if (Number.isNaN(first.getTime())) return []
  if (!end) return [first.toISOString()]

  const last = new Date(`${day}T${end}`)
  const slots: string[] = []
  for (let t = first.getTime(); t < last.getTime(); t += intervalMinutes * 60_000) {
    slots.push(new Date(t).toISOString())
  }
  return slots
}
