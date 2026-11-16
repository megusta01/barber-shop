'use client'

import { ROLE_LABELS } from '@barbearia/shared'
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode, useState } from 'react'

import { useAuth, useSession } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

import { NAVIGATION, NavItem } from './navigation'

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem
  active: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${
        active ? 'bg-indigo-50 font-semibold text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  )
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const session = useSession()
  const { signOut } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const items = NAVIGATION[session.role]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-1 text-gray-700 md:hidden"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
            <Link href={homePathFor(session.role)} className="flex items-center gap-2">
              <Image src="/logo.png" alt="" width={32} height={32} />
              <span className="font-semibold text-gray-900">Barbearia</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {items.map((item) => (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="font-medium text-gray-900">{session.name}</p>
              <p className="text-gray-500">{ROLE_LABELS[session.role]}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="space-y-1 border-t border-gray-200 px-4 py-3 md:hidden"
            aria-label="Principal"
          >
            {items.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={pathname === item.href}
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
