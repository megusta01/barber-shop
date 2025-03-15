'use client'
import React from 'react'
import axios from 'axios'
import getUserIdFromToken from '@/hooks/clientId'

interface ScheduleModalProps {
  selectedSlot: { date: string }
  barberId: string
  onClose: () => void
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ selectedSlot, barberId, onClose }) => {
  const handleSchedule = async () => {
    const token = localStorage.getItem('accessToken')
    const costumerId = getUserIdFromToken()

    if (!token || !costumerId || !selectedSlot) {
      alert('Erro ao obter informações para o agendamento')
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`,
        {
          date: selectedSlot.date,
          costumer: costumerId,
          barberId: barberId,
          status: 'pending',
          service: 'haircut',
          isPaid: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
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
        <p className="font-bold">{new Date(selectedSlot.date).toLocaleString('pt-BR', { timeZone: 'UTC' })}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSchedule}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ScheduleModal
