'use client'

import React from 'react'
import Calendar, { CalendarProps } from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

interface CalendarComponentProps {
  selectedDate: Date
  onDateChange: (value: Date) => void // Ajusta a tipagem da função de mudança
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ selectedDate, onDateChange }) => {
  return (
    <Calendar
      onChange={(value) => onDateChange(value as Date)} // Força o tipo para `Date`
      value={selectedDate}
      className='border border-gray-300 rounded-lg shadow-md'
    />
  )
}

export default CalendarComponent
