'use client';

import React, { useState, useEffect } from 'react';
import Calendar from '@/components/Calendar';
import axios from 'axios';

const CustomerAppointmentPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Lista de horários possíveis
    const allTimes = [
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
    ];

    const fetchAppointments = async (date: Date) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointment`,
                {
                    params: { date: date.toISOString().split('T')[0] }, // Envia a data no formato 'YYYY-MM-DD'
                    withCredentials: true,
                }
            );
            const bookedTimes = response.data.map((appointment: { date: string }) =>
                new Date(appointment.date).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );

            // Filtra os horários ainda disponíveis
            const freeTimes = allTimes.filter((time) => !bookedTimes.includes(time));
            setAvailableTimes(freeTimes);
        } catch (err) {
            console.error('Erro ao buscar horários disponíveis:', err);
            setError('Não foi possível carregar os horários disponíveis. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(selectedDate);
        setSelectedTime(null); // Reseta o horário selecionado quando a data muda
    }, [selectedDate]);

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

            {/* Calendário */}
            <Calendar
                onDateSelect={(date) => setSelectedDate(date || new Date())}
                selectedDate={selectedDate}
            />

            {/* Mensagem de erro */}
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {/* Lista de Horários Disponíveis */}
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
                                aria-selected={selectedTime === time}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Botão de Confirmação */}
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
