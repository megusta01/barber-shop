import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/barberSchedule`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json'
                }
            }
        )
            .then(response => {
                setAvailableSlots(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar horários disponíveis', error);
            });
    }, []);

    const handleBooking = (slotId: any) => {
        axios.post('/api/appointments', {
            slotId,
            customerId,
            service
        })
            .then(response => {
                alert('Agendamento realizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao realizar agendamento', error);
            });
    };

    return (
        <div>
            <h1>Agendar Horário</h1>
            <label>
                ID do Cliente:
                <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required />
            </label>
            <label>
                Serviço:
                <input type="text" value={service} onChange={(e) => setService(e.target.value)} required />
            </label>
            <ul>
                {availableSlots.map(slot => (
                    <li key={slot._id}>
                        <p>Data: {new Date(slot.availability).toLocaleString()}</p>
                        <p>Barbeiro: {slot.barber.name}</p>
                        <button onClick={() => handleBooking(slot._id)} disabled={slot.isBooked}>
                            {slot.isBooked ? 'Indisponível' : 'Agendar'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookAppointment;