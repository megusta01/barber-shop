'use client'

import type { AvailabilityDto } from '@barbearia/shared'
import { FormEvent, useMemo, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Field, inputClass } from '@/components/ui/Field'
import { availabilityApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'

import { generateSlots } from './slot-generator'

const INTERVALS = [15, 20, 30, 40, 45, 60]

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface Props {
  barberId: string
  onAdded: (availability: AvailabilityDto) => void
}

export function AddSlotsForm({ barberId, onAdded }: Props) {
  const [day, setDay] = useState(todayKey)
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('18:00')
  const [interval, setIntervalMinutes] = useState(30)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const slots = useMemo(
    () =>
      generateSlots({ day, start, end, intervalMinutes: interval }).filter(
        (iso) => new Date(iso).getTime() > Date.now(),
      ),
    [day, start, end, interval],
  )

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (slots.length === 0) {
      setError('Nenhum horário futuro nesse intervalo.')
      return
    }
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      onAdded(await availabilityApi.add(barberId, slots))
      setSuccess(`${slots.length} horário(s) adicionado(s).`)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Adicionar horários</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Dia">
          {(id) => (
            <input
              id={id}
              type="date"
              min={todayKey()}
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
              className={inputClass}
            />
          )}
        </Field>

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
          <Field label="Até" hint="Deixe vazio para um único horário.">
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

        <p className="text-sm text-gray-600">
          {slots.length === 0
            ? 'Nenhum horário futuro nesse intervalo.'
            : `Serão criados ${slots.length} horário(s).`}
        </p>

        {error && <Alert>{error}</Alert>}
        {success && <Alert tone="success">{success}</Alert>}

        <Button type="submit" loading={saving} disabled={slots.length === 0} className="w-full">
          Adicionar
        </Button>
      </form>
    </Card>
  )
}
