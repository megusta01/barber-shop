'use client'

import React from 'react'
import Header from '@/components/dashboard/barber/Header'
import { useBarberId } from '@/hooks/useBarberId'
import { useBarberAppointments } from '@/hooks/useBarberAppointments'
import AppointmentList from '@/components/dashboard/barber/AppointmentList'

export default function BarberAppointmentsView() {
  const barberId = useBarberId()
  const { appointments, loading, error, fetchAppointments } = useBarberAppointments(barberId)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F5F6F8] px-4 py-10">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow space-y-6">
          <h1 className="text-2xl font-semibold text-[#111827]">Meus Agendamentos</h1>

          {loading ? (
            <p className="text-sm text-gray-500">Carregando agendamentos...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <AppointmentList appointments={appointments} onUpdate={fetchAppointments} />
          )}
        </div>
      </div>
    </>
  )
}
