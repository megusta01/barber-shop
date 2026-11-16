// src/hooks/useBarberAppointments.ts
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Appointment } from '@/types/Appointment';

export const useBarberAppointments = (barberId: string | null) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async (barberId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/appointments/searchAppointment', {
        params: { barberId },
      });
      const data = res.data;
      setAppointments(data.appointments || []);
    } catch (err) {
      setError('Erro ao buscar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barberId) {
      fetchAppointments(barberId);
    }
  }, [barberId]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments: () => barberId && fetchAppointments(barberId),
  };
};
