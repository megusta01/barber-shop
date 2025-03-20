'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '@/services/api'

export default function ClientHeader() {
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link href="/dashboard/client">
          <span className="text-xl font-bold cursor-pointer">Dashboard</span>
        </Link>
        <Link href="/dashboard/client/appointments">
          <span className="cursor-pointer">Meus Agendamentos</span>
        </Link>
        <Link href="/dashboard/client/find-barbers">
          <span className="cursor-pointer">Buscar Barbeiros</span>
        </Link>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 px-3 py-1 rounded font-semibold"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
