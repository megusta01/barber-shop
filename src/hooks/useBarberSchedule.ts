import { useState, useEffect } from 'react';
import api from '@/services/api';

interface Schedule {
  availability: string[];
}

export const useBarberSchedule = (barberId: string | null) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = async () => {
    if (!barberId) return;
    try {
      setLoading(true);
      const response = await api.get(`/appointments/barberSchedule/${barberId}`);
      setSchedule(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar agenda do barbeiro', err);
      setSchedule(null);
      setError('Erro ao buscar agenda do barbeiro');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barberId) {
      fetchSchedule();
    }
  }, [barberId]);

  return { schedule, loading, error, fetchSchedule };
};
