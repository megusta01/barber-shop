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
  /** Rótulo curto para a barra inferior do celular. */
  short: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const PROFILE: NavItem = {
  href: '/dashboard/profile',
  label: 'Perfil',
  short: 'Perfil',
  icon: UserCircleIcon,
}

export const NAVIGATION: Record<Role, NavItem[]> = {
  client: [
    { href: '/dashboard/client', label: 'Agendar', short: 'Agendar', icon: ScissorsIcon },
    {
      href: '/dashboard/client/appointments',
      label: 'Meus agendamentos',
      short: 'Agendamentos',
      icon: CalendarDaysIcon,
    },
    PROFILE,
  ],
  barber: [
    { href: '/dashboard/barber', label: 'Hoje', short: 'Hoje', icon: HomeIcon },
    {
      href: '/dashboard/barber/appointments',
      label: 'Agendamentos',
      short: 'Agenda',
      icon: CalendarDaysIcon,
    },
    {
      href: '/dashboard/barber/availability',
      label: 'Meus horários',
      short: 'Horários',
      icon: ClockIcon,
    },
    PROFILE,
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Usuários', short: 'Usuários', icon: UsersIcon },
    {
      href: '/dashboard/admin/appointments',
      label: 'Agendamentos',
      short: 'Agenda',
      icon: CalendarDaysIcon,
    },
    PROFILE,
  ],
}
