// src/app/BarberAppointmentsView.tsx
'use client';

import React from 'react';
import Header from '@/components/dashboard/barber/Header';
import { useBarberId } from '@/hooks/useBarberId';
import { useBarberAppointments } from '@/hooks/useBarberAppointments';
import AppointmentList from '@/components/dashboard/barber/AppointmentList';

export default function BarberAppointmentsView() {
  const barberId = useBarberId();
  const { appointments, loading, error, fetchAppointments } = useBarberAppointments(barberId);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Meus Agendamentos</h1>
          {loading ? (
            <p>Carregando agendamentos...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <AppointmentList appointments={appointments} onUpdate={fetchAppointments} />
          )}
        </div>
      </div>
    </>
  );
}
