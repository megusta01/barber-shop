import React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { ptBR } from 'date-fns/locale'

interface CalendarProps {
  onDateSelect: (date: Date | undefined) => void // Agora aceita o tipo correto
  selectedDate: Date | undefined
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Selecione uma data</h1>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect} // Callback para a data selecionada
        locale={ptBR}
      />
    </div>
  )
}

export default Calendar
