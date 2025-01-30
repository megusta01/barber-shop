'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from '@/components/Calendar';
import axios from 'axios';

const CustomerAppointmentPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memoiza a lista de horários possíveis
    const allTimes = useMemo(
        () => [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
        ],
        []
    );

    // Função para buscar horários disponíveis
    const fetchAppointments = useCallback(async (date: Date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`,
                {
                    params: { date: date.toISOString().split('T')[0] },
                    withCredentials: true,
                }
            );

            const bookedTimes = response.data.map((appointment: { date: string }) =>
                new Date(appointment.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );

            const freeTimes = allTimes.filter((time) => !bookedTimes.includes(time));
            setAvailableTimes(freeTimes);
        } catch (err) {
            console.error('Erro ao buscar horários disponíveis:', err);
            setError('Não foi possível carregar os horários disponíveis. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [allTimes]);

    useEffect(() => {
        fetchAppointments(selectedDate);
        setSelectedTime(null);
    }, [fetchAppointments, selectedDate]);

    const handleConfirm = async () => {
        if (!selectedTime) {
            alert('Por favor, selecione um horário.');
            return;
        }

        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment`,
                {
                    date: selectedDate.toISOString().split('T')[0],
                    time: selectedTime,
                },
                { withCredentials: true }
            );
            alert(
                `Agendamento confirmado para ${selectedDate.toLocaleDateString(
                    'pt-BR'
                )} às ${selectedTime}`
            );
        } catch (error) {
            console.error('Erro ao confirmar agendamento:', error);
            alert('Não foi possível confirmar o agendamento. Tente novamente.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Agendar Horário</h1>

            <Calendar
                onDateSelect={(date) => setSelectedDate(date || new Date())}
                selectedDate={selectedDate}
            />

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Horários disponíveis para {selectedDate.toLocaleDateString('pt-BR')}
                </h2>
                {loading ? (
                    <p className="text-gray-500">Carregando horários...</p>
                ) : availableTimes.length === 0 ? (
                    <p className="text-gray-500">Nenhum horário disponível para esta data.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {availableTimes.map((time, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-4 rounded-lg font-medium ${
                                    selectedTime === time
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleConfirm}
                    className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading || !selectedTime}
                >
                    Confirmar Agendamento
                </button>
            </div>
        </div>
    );
};

export default CustomerAppointmentPage;
