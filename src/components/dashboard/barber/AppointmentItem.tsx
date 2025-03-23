import React, { useState } from 'react'
import { Appointment } from '@/types/Appointment'
import api from '@/services/api'

interface AppointmentItemProps {
  appointment: Appointment
  onUpdate: () => void
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onUpdate }) => {
  const [status, setStatus] = useState(appointment.status)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    setStatus(newStatus)
    setLoading(true)
    setError(null)

    try {
      await api.patch(`/appointments/${appointment._id}`, { status: newStatus })
      onUpdate()
    } catch (err) {
      console.error('Erro ao atualizar status do agendamento', err)
      setError('Erro ao atualizar status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition space-y-1">
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Data:</strong>{' '}
        {new Date(appointment.date).toLocaleString('pt-BR')}
      </p>
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Cliente:</strong>{' '}
        {appointment.costumer?.displayName || 'N/A'}
      </p>
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Serviço:</strong> {appointment.service}
      </p>
      <div className="flex items-center text-sm text-gray-700">
        <strong className="text-gray-900 mr-2">Status:</strong>
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={loading}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-indigo-500 focus:outline-none"
        >
          <option value="pendente">Pendente</option>
          <option value="concluido">Concluído</option>
          <option value="cancelado">Cancelado</option>
        </select>
        {error && <span className="text-red-500 ml-3">{error}</span>}
      </div>
    </li>
  )
}

export default AppointmentItem
