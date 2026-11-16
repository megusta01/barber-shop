'use client'

import React, { useState } from 'react'
import Header from '@/components/dashboard/client/Header'
import BarberSelect from '@/components/dashboard/client/BarberSelect'
import BarberAvailableSlots from '@/components/dashboard/client/BarberAvailableSlots'

export default function ClientDashboard() {
    const [selectedBarberId, setSelectedBarberId] = useState<string>('')

    return (
        <>
            <Header />
            <div className="flex gap-4">
                {/* <div>
                    <Calendar />
                </div> */}
                <div>
                    <BarberSelect onChange={(id) => setSelectedBarberId(id)} value={selectedBarberId} />

                    {selectedBarberId && <BarberAvailableSlots barberId={selectedBarberId} />}
                </div>
            </div>
        </>
    )
}
