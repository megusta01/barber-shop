'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Calendar from '@/components/Calendar';
import axios from 'axios';

// Define o tipo para os agendamentos
interface Appointment {
    customerName: string;
    service: string;
    date: string;
}

const BarberAppointmentsPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar agendamentos
    const fetchAppointments = useCallback(async (date: Date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Appointment[]>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment/searchAppointment`,
                {
                    params: { date: date.toISOString() },
                    withCredentials: true,
                }
            );

            setAppointments(response.data);
        } catch (err: unknown) {
            const errorMessage = (err as Error).message || 'Erro desconhecido';
            console.error('Erro ao buscar agendamentos:', errorMessage);
            setError('Não foi possível carregar os agendamentos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Chama fetchAppointments sempre que a data selecionada mudar
    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [fetchAppointments, selectedDate]);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Agendamentos do Barbeiro</h1>

            <Calendar
                onDateSelect={(date) => setSelectedDate(date || new Date())}
                selectedDate={selectedDate}
            />

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
                </h2>

                {loading ? (
                    <p className="text-gray-500">Carregando agendamentos...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-gray-500">Nenhum cliente agendado para esta data.</p>
                ) : (
                    <ul className="space-y-4">
                        {appointments.map((appointment, index) => (
                            <li key={index} className="p-4 border rounded-lg shadow-md">
                                <p>
                                    <strong>Cliente:</strong> {appointment.customerName}
                                </p>
                                <p>
                                    <strong>Serviço:</strong> {appointment.service}
                                </p>
                                <p>
                                    <strong>Horário:</strong>{' '}
                                    {new Date(appointment.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BarberAppointmentsPage;
