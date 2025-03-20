'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BarberHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard/barber">
          <span className="text-xl font-bold cursor-pointer">Dashboard</span>
        </Link>
        <Link href="/dashboard/barber/appointments">
          <span className="cursor-pointer">Meus Agendamentos</span>
        </Link>
        <Link href="/dashboard/barber/availability">
          <span className="cursor-pointer">Criar Horários</span>
        </Link>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded font-semibold"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
