'use client'

import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import axios from 'axios'
import 'react-calendar/dist/Calendar.css'

const CustomerAppointmentPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [selectedTime, setSelectedTime] = useState<string | null>(null)

    // Buscar horários disponíveis ao mudar a data selecionada
    useEffect(() => {
        const fetchAvailableTimes = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/available`,
                    {
                        params: { date: selectedDate.toISOString() },
                        withCredentials: true,
                    }
                )
                setAvailableTimes(response.data)
            } catch (error) {
                console.error('Erro ao buscar horários disponíveis:', error)
            }
        }

        fetchAvailableTimes()
    }, [selectedDate])

    const handleSubmit = () => {
        if (!selectedTime) {
            alert('Por favor, selecione um horário.')
            return
        }

        // Enviar dados para criar o agendamento
        alert(`Agendamento confirmado para ${selectedDate.toLocaleDateString()} às ${selectedTime}`)
    }

    return (
        <div className='container mx-auto px-4 py-6'>
            {/* Cabeçalho */}
            <div className='flex justify-between items-center mb-6'>
                <h1 className='text-2xl font-bold'>Agende seu horário</h1>
                <button className='text-blue-600 hover:underline'>Help</button>
            </div>

            {/* Calendário */}
            <div className='mb-8'>
                <h2 className='text-lg font-semibold mb-2'>Escolha uma data</h2>
                <Calendar
                    onChange={(value) => setSelectedDate(value as Date)} // Força o tipo para `Date`
                    value={selectedDate}
                    className='border border-gray-300 rounded-lg shadow-md'
                />
            </div>

            {/* Horários Disponíveis */}
            <div className='mb-8'>
                <h2 className='text-lg font-semibold mb-2'>Escolha um horário</h2>
                <div className='grid grid-cols-3 gap-4'>
                    {availableTimes.length === 0 ? (
                        <p className='col-span-3 text-gray-500'>Nenhum horário disponível.</p>
                    ) : (
                        availableTimes.map((time, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedTime(time)}
                                className={`py-2 px-4 rounded-lg font-medium ${selectedTime === time
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                    }`}
                            >
                                {time}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Botão Confirmar */}
            <div className='text-center'>
                <button
                    onClick={handleSubmit}
                    className='py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                    Confirm Appointment
                </button>
            </div>
        </div>
    )
}

export default CustomerAppointmentPage
