'use client'

import type { AvailabilityDto } from '@barbearia/shared'
import { FormEvent, useMemo, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card, CardTitle } from '@/components/ui/Card'
import { Field, inputClass } from '@/components/ui/Field'
import { availabilityApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { dayKey, formatWeekdayShort } from '@/lib/format'

import { generateSlots } from './slot-generator'

const DAYS_AHEAD = 14
const INTERVALS = [15, 20, 30, 40, 45, 60]
const PERIODS = [
  { label: 'Manhã', start: '09:00', end: '12:00' },
  { label: 'Tarde', start: '14:00', end: '18:00' },
  { label: 'Dia todo', start: '09:00', end: '18:00' },
]

function nextDays(): { key: string; date: Date }[] {
  return Array.from({ length: DAYS_AHEAD }, (_, i) => {
    const date = new Date()
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + i)
    return { key: dayKey(date), date }
  })
}

interface Props {
  barberId: string
  onAdded: (availability: AvailabilityDto) => void
}

export function AddSlotsForm({ barberId, onAdded }: Props) {
  const days = useMemo(nextDays, [])
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('18:00')
  // começa no primeiro dia que ainda comporta o período padrão (à noite, já é amanhã)
  const [selectedDays, setSelectedDays] = useState<string[]>(() => {
    const todayHasRoom = generateSlots({
      days: [days[0].key],
      start: '09:00',
      end: '18:00',
      intervalMinutes: 30,
    }).some((iso) => new Date(iso).getTime() > Date.now())
    return [days[todayHasRoom ? 0 : 1].key]
  })
  const [interval, setIntervalMinutes] = useState(30)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const slots = useMemo(
    () =>
      generateSlots({ days: selectedDays, start, end, intervalMinutes: interval }).filter(
        (iso) => new Date(iso).getTime() > Date.now(),
      ),
    [selectedDays, start, end, interval],
  )

  const toggleDay = (key: string) =>
    setSelectedDays((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (slots.length === 0) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      onAdded(await availabilityApi.add(barberId, slots))
      setSelectedDays([])
      setSuccess(
        `${slots.length} horário${slots.length > 1 ? 's' : ''} aberto${slots.length > 1 ? 's' : ''}.`,
      )
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const activePeriod = PERIODS.find((p) => p.start === start && p.end === end)?.label

  return (
    <Card>
      <CardTitle hint="Escolha os dias e o período; os clientes já veem os horários.">
        Abrir horários
      </CardTitle>
      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Dias</legend>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map(({ key, date }, i) => {
              const on = selectedDays.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleDay(key)}
                  title={i === 0 ? 'Hoje' : undefined}
                  className={`flex flex-col items-center rounded-lg border py-1.5 leading-tight transition-colors ${
                    on
                      ? 'border-charcoal bg-charcoal text-paper'
                      : 'border-line bg-white text-ink hover:border-muted/50'
                  }`}
                >
                  <span
                    className={`text-[11px] capitalize ${on ? 'text-stone-300' : 'text-muted'}`}
                  >
                    {i === 0 ? 'hoje' : formatWeekdayShort(date.toISOString())}
                  </span>
                  <span className="font-display text-lg font-semibold tabular-nums">
                    {date.getDate()}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-ink">Período</legend>
          <div className="mb-3 flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.label}
                type="button"
                aria-pressed={activePeriod === p.label}
                onClick={() => {
                  setStart(p.start)
                  setEnd(p.end)
                }}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activePeriod === p.label
                    ? 'border-brass-500 bg-brass-50 text-brass-700'
                    : 'border-line bg-white text-ink hover:border-muted/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Das">
              {(id) => (
                <input
                  id={id}
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Até">
              {(id) => (
                <input
                  id={id}
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
        </fieldset>

        <Field label="Duração de cada atendimento">
          {(id) => (
            <select
              id={id}
              value={interval}
              disabled={!end}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              className={inputClass}
            >
              {INTERVALS.map((m) => (
                <option key={m} value={m}>
                  {m} minutos
                </option>
              ))}
            </select>
          )}
        </Field>

        {error && <Alert>{error}</Alert>}
        {success && <Alert tone="success">{success}</Alert>}

        <Button
          type="submit"
          size="lg"
          loading={saving}
          disabled={slots.length === 0}
          className="w-full"
        >
          {slots.length === 0
            ? 'Escolha dias e um período futuro'
            : `Abrir ${slots.length} horário${slots.length > 1 ? 's' : ''}`}
        </Button>
      </form>
    </Card>
  )
}
