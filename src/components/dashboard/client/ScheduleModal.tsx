'use client'
import React, { useState } from 'react'
import api from '@/services/api'
import getUserIdFromToken from '@/hooks/clientId'
import getUserNameFromToken from '@/hooks/useClientName'

interface ScheduleModalProps {
  selectedSlot: { date: string }
  barberId: string
  onClose: () => void
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ selectedSlot, barberId, onClose }) => {
  const clientName = getUserNameFromToken()
  const [selectedService, setSelectedService] = useState<string>('cabelo')

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
        status: 'pendente',
        service: selectedService,
        isPaid: false,
      })
      alert('Agendamento realizado com sucesso!')
      onClose()
    } catch (err: any) {
      alert(`Erro ao agendar: ${err.message}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Confirmar Agendamento</h3>

        <div className="text-sm text-gray-700 space-y-2 mb-6">
          <p><strong>Cliente:</strong> {clientName}</p>
          <p>
            <strong>Horário:</strong>{' '}
            {new Date(selectedSlot.date).toLocaleString('pt-BR', { timeZone: 'UTC' })}
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="service-select" className="block text-sm font-medium text-gray-700 mb-1">
            Serviço
          </label>
          <select
            id="service-select"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:outline-none"
          >
            <option value="cabelo">Cabelo</option>
            <option value="barba">Barba</option>
            <option value="cabelo e barba">Cabelo e Barba</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500 transition"
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
