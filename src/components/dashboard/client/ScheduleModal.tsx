'use client'
import React from 'react'
import api from '@/services/api'
import getUserIdFromToken from '@/hooks/clientId'

interface ScheduleModalProps {
  selectedSlot: { date: string }
  barberId: string
  onClose: () => void
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ selectedSlot, barberId, onClose }) => {
  const handleSchedule = async () => {
    const costumerId = getUserIdFromToken()

    if (!costumerId || !selectedSlot) {
      alert('Erro ao obter informações para o agendamento')
      return
    }

    try {
      await api.post('/appointments', {
        date: selectedSlot.date,
        costumer: costumerId,
        barberId: barberId,
        status: 'pending',
        service: 'haircut',
        isPaid: false,
      })
      alert('Agendamento realizado com sucesso!')
      onClose()
    } catch (err: any) {
      alert(`Erro ao agendar: ${err.message}`)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Confirmar Agendamento</h3>
        <p>Você deseja agendar um horário para:</p>
        <p className="font-bold">
          {new Date(selectedSlot.date).toLocaleString('pt-BR', { timeZone: 'UTC' })}
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSchedule}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal
