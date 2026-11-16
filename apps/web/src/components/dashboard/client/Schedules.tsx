import React, { useEffect, useState } from 'react';
import api from '@/services/api';

const BookAppointment = () => {
  interface Slot {
    _id: string;
    availability: string;
    barber: {
      name: string;
    };
    isBooked: boolean;
  }

  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    async function fetchAvailableSlots() {
      try {
        const response = await api.get('/appointments/barberSchedule', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis', error);
      }
    }
    fetchAvailableSlots();
  }, []);

  const handleBooking = async (slotId: string) => {
    try {
      await api.post('/api/appointments', {
        slotId,
        customerId,
        service
      });
      alert('Agendamento realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar agendamento', error);
    }
  };

  return (
    <div>
      <h1>Agendar Horário</h1>
      <label>
        ID do Cliente:
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        />
      </label>
      <label>
        Serviço:
        <input
          type="text"
          value={service}
          onChange={(e) => setService(e.target.value)}
          required
        />
      </label>
      <ul>
        {availableSlots.map((slot) => (
          <li key={slot._id}>
            <p>Data: {new Date(slot.availability).toLocaleString()}</p>
            <p>Barbeiro: {slot.barber.name}</p>
            <button
              onClick={() => handleBooking(slot._id)}
              disabled={slot.isBooked}
            >
              {slot.isBooked ? 'Indisponível' : 'Agendar'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookAppointment;
