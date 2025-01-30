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

    const formatDate = (date: string | Date) =>
        new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const fetchAppointments = useCallback(async (date: Date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Appointment[]>(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/searchAppointment?date=2025-01-27T10:30:00.000+00:00`,
                {
                    params: { date: date.toISOString().split('T')[0] },
                    withCredentials: true,
                }
            );
            setAppointments(response.data);
        } catch (err: unknown) {
            console.error('Erro ao buscar agendamentos:', err);
            setError('Não foi possível carregar os agendamentos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [fetchAppointments, selectedDate]);

    return (
        <div className="container mx-auto px-4 py-6 flex flex-row justify-center items-center space-x-10">
            <div className="w-1/2 flex justify-center">
                <Calendar
                    onDateSelect={(date) => setSelectedDate(date || new Date())}
                    selectedDate={selectedDate}
                />
            </div>
            <div className="w-1/2">
                <h1 className="text-2xl font-bold mb-6 text-center">Agendamentos do Barbeiro</h1>
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4 text-center">
                        {`Agendamentos em ${selectedDate.toLocaleDateString('pt-BR')}`}
                    </h2>
                    {loading ? (
                        <div className="flex justify-center">
                            <p className="text-gray-500">Carregando agendamentos...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <p className="text-gray-500 text-center">Nenhum cliente agendado para esta data.</p>
                    ) : (
                        <ul className="space-y-4">
                            {appointments.map((appointment, index) => (
                                <li key={index} className="p-4 border rounded-lg shadow-md text-center">
                                    <p><strong>Horário:</strong> {formatDate(appointment.date)}</p>
                                    <p><strong>{appointment.customerName}</strong></p>
                                    <p>{appointment.service}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BarberAppointmentsPage;
