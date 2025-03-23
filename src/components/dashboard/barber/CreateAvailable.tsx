import React, { useState } from 'react'
import api from '@/services/api'

interface CreateAvailableSlotFormProps {
  barberId: string | null
  onSuccess: () => void
}

const CreateAvailableSlotForm: React.FC<CreateAvailableSlotFormProps> = ({ barberId, onSuccess }) => {
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!barberId) {
      setError('Barbeiro não identificado.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const inputDate = new Date(date)
    if (isNaN(inputDate.getTime())) {
      setError('Data inválida. Por favor, verifique a data e hora informadas.')
      setLoading(false)
      return
    }

    const now = new Date()
    if (inputDate <= now) {
      setError('Por favor, selecione uma data e hora futuras.')
      setLoading(false)
      return
    }

    try {
      const availableDate = inputDate.toISOString()
      await api.patch(`/appointments/addDateBarberSchedule/${barberId}`, {
        date: [availableDate],
      })

      setSuccessMessage('Horário disponível criado com sucesso!')
      setDate('')
      onSuccess()
    } catch (err) {
      console.error('Erro ao criar horário disponível', err)
      setError('Erro ao criar horário disponível. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 w-full space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Criar Horário Disponível</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Data e Hora</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">ID do Barbeiro</label>
        <input
          type="text"
          value={barberId || 'Carregando...'}
          disabled
          className="w-full p-2 border border-gray-300 bg-gray-100 rounded-md text-sm cursor-not-allowed"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded-md transition disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar Horário Disponível'}
      </button>
    </form>
  )
}

export default CreateAvailableSlotForm
