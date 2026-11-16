import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/figtree'
import './globals.css'

import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'

import { AuthProvider } from '@/lib/auth/AuthProvider'

export const metadata: Metadata = {
  title: { default: 'Barbearia', template: '%s · Barbearia' },
  description: 'Agendamento online para barbearias: clientes, barbeiros e horários em um só lugar.',
}

export const viewport: Viewport = { themeColor: '#1C1917' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
