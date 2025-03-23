'use client'
import React, { useEffect, useState } from 'react'
import api from '@/services/api'
import ScheduleModal from './ScheduleModal'

interface AvailableSlot {
  date: string
}

interface BarberAvailableSlotsProps {
  barberId: string
}

const BarberAvailableSlots: React.FC<BarberAvailableSlotsProps> = ({ barberId }) => {
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!barberId) return

    async function fetchAvailableSlots() {
      setLoading(true)
      setError(null)

      try {
        const res = await api.get(`/appointments/barberSchedule/${barberId}`)

        if (!res.data || !res.data.availability) {
          setError('Resposta inválida da API')
          return
        }

        setAvailableSlots(res.data.availability.map((slot: any) => ({ date: slot })))
      } catch (err: any) {
        setError(`Erro ao buscar os horários disponíveis: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchAvailableSlots()
  }, [barberId])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Horários Disponíveis</h2>

      {loading && <p className="text-sm text-gray-500">Carregando horários disponíveis...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && availableSlots.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum horário disponível encontrado.</p>
      )}

      {!loading && !error && availableSlots.length > 0 && (
        <ul className="space-y-3">
          {availableSlots.map((slot, index) => (
            <li
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition"
            >
              <span className="text-sm text-gray-700">
                {new Date(slot.date).toLocaleString('pt-BR', { timeZone: 'UTC' })}
              </span>
              <button
                className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-500 transition"
                onClick={() => {
                  setSelectedSlot(slot)
                  setShowModal(true)
                }}
              >
                Agendar
              </button>
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedSlot && (
        <ScheduleModal
          selectedSlot={selectedSlot}
          barberId={barberId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default BarberAvailableSlots
