// src/app/CreateAvailableSlot.tsx
'use client';

import React from 'react';
import Header from '@/components/dashboard/barber/Header';
import { useBarberId } from '@/hooks/useBarberId';
import { useBarberSchedule } from '@/hooks/useBarberSchedule';
import CreateAvailableSlotForm from '@/components/dashboard/barber/CreateAvailable';
import AvailableSlotsList from '@/components/dashboard/barber/AvailableList';

export default function CreateAvailableSlot() {
  const barberId = useBarberId();
  const { schedule, fetchSchedule } = useBarberSchedule(barberId);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div>
          <CreateAvailableSlotForm barberId={barberId} onSuccess={fetchSchedule} />
          <AvailableSlotsList schedule={schedule} />
        </div>
      </div>
    </>
  );
}
