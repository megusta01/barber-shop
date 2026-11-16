import './globals.css'

import type { Metadata } from 'next'
import { ReactNode } from 'react'

import { AuthProvider } from '@/lib/auth/AuthProvider'

export const metadata: Metadata = {
  title: { default: 'Barbearia', template: '%s · Barbearia' },
  description: 'Agendamento online para barbearias: clientes, barbeiros e horários em um só lugar.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
