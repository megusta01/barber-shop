import type { Role } from '@barbearia/shared'
import {
  CalendarDaysIcon,
  ClockIcon,
  HomeIcon,
  ScissorsIcon,
  UserCircleIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import type { ComponentType, SVGProps } from 'react'

export interface NavItem {
  href: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const PROFILE: NavItem = { href: '/dashboard/profile', label: 'Perfil', icon: UserCircleIcon }

export const NAVIGATION: Record<Role, NavItem[]> = {
  client: [
    { href: '/dashboard/client', label: 'Agendar', icon: ScissorsIcon },
    { href: '/dashboard/client/appointments', label: 'Meus agendamentos', icon: CalendarDaysIcon },
    PROFILE,
  ],
  barber: [
    { href: '/dashboard/barber', label: 'Hoje', icon: HomeIcon },
    { href: '/dashboard/barber/appointments', label: 'Agendamentos', icon: CalendarDaysIcon },
    { href: '/dashboard/barber/availability', label: 'Disponibilidade', icon: ClockIcon },
    PROFILE,
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Usuários', icon: UsersIcon },
    { href: '/dashboard/admin/appointments', label: 'Agendamentos', icon: CalendarDaysIcon },
    PROFILE,
  ],
}
