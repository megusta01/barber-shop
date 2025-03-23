'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { logout } from '@/services/api'
import {
  HomeIcon,
  CalendarDaysIcon,
  ScissorsIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ClientHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path
  const linkClass = (active: boolean) =>
    `flex items-center gap-2 transition cursor-pointer ${active ? 'text-indigo-600 font-semibold' : 'text-gray-800 hover:text-indigo-600'
    }`

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-800" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-800" />
          )}
        </button>
        <span className="text-lg font-semibold text-gray-800">BarberShop</span>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/dashboard/client">
            <span className={linkClass(isActive('/dashboard/client'))}>
              <HomeIcon className="w-5 h-5" />
              Início
            </span>
          </Link>
          <Link href="/dashboard/client/appointments">
            <span className={linkClass(isActive('/dashboard/client/appointments'))}>
              <CalendarDaysIcon className="w-5 h-5" />
              Meus Agendamentos
            </span>
          </Link>
          <Link href="/dashboard/client">
            <span className={linkClass(isActive('/dashboard/client'))}>
              <ScissorsIcon className="w-5 h-5" />
              Buscar Barbeiros
            </span>
          </Link>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-500 transition"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Sair
      </button>


      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white border-t border-gray-200 md:hidden z-50 shadow-md">
          <div className="flex flex-col px-6 py-4 space-y-4 text-sm">
            <Link href="/dashboard/client">
              <span className={linkClass(isActive('/dashboard/client'))}>
                <HomeIcon className="w-5 h-5" />
                Início
              </span>
            </Link>
            <Link href="/dashboard/client/appointments">
              <span className={linkClass(isActive('/dashboard/client/appointments'))}>
                <CalendarDaysIcon className="w-5 h-5" />
                Meus Agendamentos
              </span>
            </Link>
            <Link href="/dashboard/client">
              <span className={linkClass(isActive('/dashboard/client'))}>
                <ScissorsIcon className="w-5 h-5" />
                Buscar Barbeiros
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
