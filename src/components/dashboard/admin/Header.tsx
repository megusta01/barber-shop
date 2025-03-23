'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { logout } from '@/services/api'
import {
    ArrowRightOnRectangleIcon,
    UsersIcon,
} from '@heroicons/react/24/outline'

export default function AdminHeader() {
    const router = useRouter()
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    const handleLogout = () => {
        logout()
        router.push('/login')
    }


    const linkClass = (active: boolean) =>
        `flex items-center gap-2 cursor-pointer transition ${active ? 'text-indigo-600 font-semibold' : 'text-gray-800 hover:text-indigo-600'
        }`

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-6 font-medium">
                <Link href="/dashboard/admin">
                    <span className={linkClass(isActive('/dashboard/admin'))}>
                        <UsersIcon className="w-5 h-5" />
                        Gerenciar Usuários
                    </span>
                </Link>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-500 transition"
            >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                Sair
            </button>
        </header>
    )
}
