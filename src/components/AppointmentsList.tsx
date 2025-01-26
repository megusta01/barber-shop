'use client'

import React from 'react'

interface Appointment {
  date: string
  costumerName: string
  service: string
}

interface AppointmentsListProps {
  appointments: Appointment[]
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  if (appointments.length === 0) {
    return <p className='text-gray-500'>Nenhum agendamento para esta data.</p>
  }

  return (
    <div className='space-y-4'>
      {appointments.map((appointment, index) => (
        <div key={index} className='flex items-center'>
          {/* Horário */}
          <div className='w-20 text-gray-600 font-bold'>
            {new Date(appointment.date).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>

          {/* Detalhes */}
          <div className='flex-grow border-l pl-4'>
            <p className='text-gray-700 font-medium'>{appointment.costumerName}</p>
            <p className='text-gray-500 text-sm'>{appointment.service}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AppointmentsList
