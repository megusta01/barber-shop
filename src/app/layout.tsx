import '../styles/globals.css'
import React from 'react'
import Header from '../components/Header'

export const metadata = {
  title: 'Minha Aplicação',
  description: 'Gerenciamento de agendamentos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body className='bg-gray-50 text-gray-800'>
        <Header />
        <main className='container mx-auto px-4 py-6'>{children}</main>
      </body>
    </html>
  )
}
