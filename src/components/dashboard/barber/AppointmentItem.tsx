// src/components/AppointmentItem.tsx
import React, { useState } from 'react';
import { Appointment } from '@/types/Appointment';
import api from '@/services/api';

interface AppointmentItemProps {
  appointment: Appointment;
  onUpdate: () => void; // callback para atualizar a lista
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onUpdate }) => {
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    setError(null);

    try {
      await api.patch(`/appointments/${appointment._id}`, { status: newStatus });
      onUpdate(); // Atualiza a lista de agendamentos
    } catch (err) {
      console.error('Erro ao atualizar status do agendamento', err);
      setError('Erro ao atualizar status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="p-3 border border-gray-200 rounded flex flex-col md:flex-row md:justify-between">
      <span>
        <strong>Data:</strong> {new Date(appointment.date).toLocaleString('pt-BR')}
      </span>
      <span>
        <strong>Cliente:</strong> {appointment.costumer?.displayName || 'N/A'}
      </span>
      <span>
        <strong>Serviço:</strong> {appointment.service}
      </span>
      <span className="flex items-center">
        <strong>Status:</strong>
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={loading}
          className="ml-2 border border-gray-300 rounded p-1"
        >
          <option value="pending">Pendente</option>
          <option value="confirmed">Concluido</option>
          <option value="cancelled">Cancelado</option>
        </select>
        {error && <span className="text-red-500 ml-2">{error}</span>}
      </span>
    </li>
  );
};

export default AppointmentItem;
