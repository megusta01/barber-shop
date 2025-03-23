'use client'

import React from 'react'
import Header from '@/components/dashboard/client/Header'
import useClientId from '@/hooks/clientId'
import { useClientAppointment } from '@/hooks/useClientAppointment'
import AppointmentList from '@/components/dashboard/client/Appointment'

export default function ClientAppointment() {
  const costumer = useClientId()
  const { appointments, loading, error, fetchAppointments } = useClientAppointment(costumer)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F5F6F8] px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-3xl font-semibold text-[#111827] mb-6">Meus Agendamentos</h1>

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
