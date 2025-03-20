// src/components/CreateAvailableSlotForm.tsx
import React, { useState } from 'react';
import api from '@/services/api';

interface CreateAvailableSlotFormProps {
  barberId: string | null;
  onSuccess: () => void;
}

const CreateAvailableSlotForm: React.FC<CreateAvailableSlotFormProps> = ({ barberId, onSuccess }) => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!barberId) {
      setError('Barbeiro não identificado.');
      setLoading(false);
      return;
    }

    try {
      const availableDate = new Date(date).toISOString();
      await api.patch(`/appointments/addDateBarberSchedule/${barberId}`, {
        date: [availableDate],
      });

      setSuccessMessage('Horário disponível criado com sucesso!');
      setDate('');
      onSuccess(); // Atualiza a agenda após o sucesso
    } catch (err) {
      console.error('Erro ao criar horário disponível', err);
      setError('Erro ao criar horário disponível. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Criar Horário Disponível</h2>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">Data e Hora:</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium">ID do Barbeiro:</label>
        <input
          type="text"
          value={barberId || 'Carregando...'}
          disabled
          className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-200 cursor-not-allowed"
        />
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Criando...' : 'Criar Horário Disponível'}
      </button>
    </form>
  );
};

export default CreateAvailableSlotForm;
