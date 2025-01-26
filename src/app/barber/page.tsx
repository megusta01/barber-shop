'use client';

import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';

const BarberAppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar agendamentos usando fetch
    const fetchAppointments = async (date: Date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment?date=${date.toISOString().split('T')[0]}`, 
                {
                    method: 'GET',
                    credentials: 'include', // Para enviar cookies, se necessário
                }
            );

            if (!response.ok) {
                throw new Error('Erro ao buscar agendamentos');
            }

            const data = await response.json();
            setAppointments(data);
        } catch (err: any) {
            console.error('Erro ao buscar agendamentos:', err.message);
            setError('Não foi possível carregar os agendamentos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Chama fetchAppointments sempre que a data selecionada muda
    useEffect(() => {
        fetchAppointments(selectedDate);
    }, [selectedDate]);

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Agendamentos do Barbeiro</h1>

            {/* Componente de Calendário */}
            <Calendar
                onDateSelect={(date) => setSelectedDate(date || new Date())}
                selectedDate={selectedDate}
            />

            {/* Exibição de Erros */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Lista de Clientes */}
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
                        {appointments.map((appointment: any, index: number) => (
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
