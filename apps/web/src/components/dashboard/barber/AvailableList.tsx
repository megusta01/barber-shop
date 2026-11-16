import React, { useState } from 'react'
import api from '@/services/api'

interface AvailableSlotsListProps {
  schedule: { availability: string[] } | null
  barberId: string | null
  onSuccess: () => void
}

const AvailableSlotsList: React.FC<AvailableSlotsListProps> = ({ schedule, barberId, onSuccess }) => {
  const [removingSlot, setRemovingSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!schedule || schedule.availability.length === 0) return null

  const handleRemove = async (date: string) => {
    const confirmado = window.confirm(
      `Tem certeza que deseja remover o horário ${new Date(date).toLocaleString('pt-BR')}?`
    )

    if (!confirmado) return

    try {
      setRemovingSlot(date)
      setError(null)
      await api.patch(`/appointments/removeDateBarberSchedule/${barberId}`, {
        date: [date],
      })
      onSuccess()
    } catch (err) {
      console.error('Erro ao remover horário disponível', err)
      setError('Erro ao remover horário. Tente novamente.')
    } finally {
      setRemovingSlot(null)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Horários Criados</h3>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-2 text-sm text-gray-700">
        {schedule.availability.map((slot) => (
          <li key={slot} className="border border-gray-200 rounded p-3 bg-gray-50 flex justify-between items-center">
            <span>{new Date(slot).toLocaleString('pt-BR')}</span>
            <button
              onClick={() => handleRemove(slot)}
              disabled={removingSlot === slot}
              className="text-red-600 hover:underline text-xs ml-4"
            >
              {removingSlot === slot ? 'Removendo...' : 'Remover'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AvailableSlotsList
