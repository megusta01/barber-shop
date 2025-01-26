'use client'

import React, { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import axios from 'axios'
import 'react-calendar/dist/Calendar.css'

const BarberAppointmentsPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    interface Appointment {
        date: string;
        customerName: string;
        service: string;
    }

    const [appointments, setAppointments] = useState<Appointment[]>([])

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`,
                    {
                        params: { date: selectedDate.toISOString() },
                        withCredentials: true,
                    }
                )
                setAppointments(response.data)
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error)
            }
        }

        fetchAppointments()
    }, [selectedDate])

    return (
        <div className='flex flex-col lg:flex-row container mx-auto px-4 py-6'>
            {/* Calendário */}
            <div className='w-full lg:w-1/3'>
                <Calendar
                    onChange={(value) => setSelectedDate(value as Date)} // Força o tipo para `Date`
                    value={selectedDate}
                    className='border border-gray-300 rounded-lg shadow-md'
                />

            </div>

            {/* Lista de Agendamentos */}
            <div className='w-full lg:w-2/3 mt-6 lg:mt-0 lg:ml-8'>
                <h2 className='text-xl font-bold mb-4'>
                    Clientes para {selectedDate.toLocaleDateString()}
                </h2>

                {appointments.length === 0 ? (
                    <p className='text-gray-500'>Nenhum cliente agendado neste dia.</p>
                ) : (
                    <div className='space-y-4'>
                        {appointments.map((appointment, index) => (
                            <div key={index} className='flex items-center'>
                                <div className='w-20 text-gray-600 font-bold'>
                                    {new Date(appointment.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                                <div className='flex-grow border-l pl-4'>
                                    <p className='text-gray-700 font-medium'>{appointment.customerName}</p>
                                    <p className='text-gray-500 text-sm'>{appointment.service}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default BarberAppointmentsPage
