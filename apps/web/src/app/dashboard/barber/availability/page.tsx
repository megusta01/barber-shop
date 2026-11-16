'use client'

import React from 'react'
import Header from '@/components/dashboard/barber/Header'
import { useBarberId } from '@/hooks/useBarberId'
import { useBarberSchedule } from '@/hooks/useBarberSchedule'
import CreateAvailableSlotForm from '@/components/dashboard/barber/CreateAvailable'
import AvailableSlotsList from '@/components/dashboard/barber/AvailableList'

export default function CreateAvailableSlot() {
  const barberId = useBarberId()
  const { schedule, fetchSchedule } = useBarberSchedule(barberId)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F5F6F8] px-4 py-10">
        <div className="max-w-xl mx-auto space-y-6">
          <CreateAvailableSlotForm barberId={barberId} onSuccess={fetchSchedule} />
          <AvailableSlotsList
            key={JSON.stringify(schedule?.availability)}
            schedule={schedule}
            barberId={barberId}
            onSuccess={fetchSchedule}
          />
        </div>
      </div>
    </>
  )
}
