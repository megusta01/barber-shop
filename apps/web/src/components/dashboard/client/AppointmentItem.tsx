import { Appointment } from '@/types/Appointment'

interface AppointmentItemProps {
  appointment: Appointment
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment }) => {
  return (
    <li className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition space-y-1">
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Data:</strong>{' '}
        {new Date(appointment.date).toLocaleString('pt-BR')}
      </p>
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Barbeiro:</strong>{' '}
        {appointment.barberId?.displayName || 'N/A'}
      </p>
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Serviço:</strong> {appointment.service}
      </p>
      <p className="text-sm text-gray-700">
        <strong className="text-gray-900">Status:</strong> {appointment.status}
      </p>
    </li>
  )
}

export default AppointmentItem
