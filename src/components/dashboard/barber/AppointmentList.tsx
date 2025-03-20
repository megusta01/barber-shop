// src/components/AppointmentList.tsx
import React from 'react';
import { Appointment } from '@/types/Appointment';
import AppointmentItem from './AppointmentItem';

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdate: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onUpdate }) => {
  if (!appointments || appointments.length === 0) {
    return <p>Nenhum agendamento encontrado.</p>;
  }

  return (
    <ul className="space-y-2">
      {appointments.map((apt) => (
        <AppointmentItem key={apt._id} appointment={apt} onUpdate={onUpdate} />
      ))}
    </ul>
  );
};

export default AppointmentList;
