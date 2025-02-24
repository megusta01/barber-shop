import '../app/globals.css'
import React from 'react'

export const metadata = {
  title: 'Barbearia',
  description: 'Sistema de agendamentos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='bg-gray-50 text-gray-800'>
        {children}
      </body>
    </html>
  )
}
