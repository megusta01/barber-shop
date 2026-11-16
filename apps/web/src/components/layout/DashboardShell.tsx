'use client'

import { ROLE_LABELS } from '@barbearia/shared'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { Avatar } from '@/components/ui/Avatar'
import { useAuth, useSession } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

import { Brand } from './Brand'
import { NAVIGATION } from './navigation'

export function DashboardShell({ children }: { children: ReactNode }) {
  const session = useSession()
  const { signOut } = useAuth()
  const pathname = usePathname()
  const items = NAVIGATION[session.role]

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="pole-stripe h-1" aria-hidden />
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4">
          <Brand href={homePathFor(session.role)} />

          <nav className="hidden h-full items-stretch gap-1 md:flex" aria-label="Principal">
            {items.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center border-b-2 px-3 text-sm font-medium transition-colors ${
                    active
                      ? 'border-brass-500 text-charcoal'
                      : 'border-transparent text-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2.5 sm:flex">
              <Avatar name={session.name} size={32} />
              <div className="text-xs leading-tight">
                <p className="font-semibold text-ink">{session.name}</p>
                <p className="text-muted">{ROLE_LABELS[session.role]}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted hover:bg-charcoal/5 hover:text-ink"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 md:pb-16 md:pt-10">{children}</main>

      {/* Barra inferior no celular: as seções ficam a um toque do polegar */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {items.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                    active ? 'text-charcoal' : 'text-muted'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${active ? 'text-brass-600' : ''}`}
                    aria-hidden
                    strokeWidth={active ? 2 : 1.5}
                  />
                  {item.short}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
