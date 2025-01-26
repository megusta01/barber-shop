import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <header className='bg-white border-b border-gray-200'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link href='/'>
            <img
              src='/new-logo.svg' // Substitua pelo caminho da sua logo
              alt='Logo'
              className='h-20 w-auto'
            />
          </Link>
        </div>

        {/* Navegação */}
        <nav className='hidden md:flex space-x-6'>
          <Link href='/barber' className='text-gray-700 hover:text-black'>
            Agendamentos
          </Link>
          <Link href='/customer' className='text-gray-700 hover:text-black'>
            Serviços
          </Link>
          <Link href='/barbers' className='text-gray-700 hover:text-black'>
            Barbeiros
          </Link>
        </nav>

        {/* Botões */}
        <div className='flex items-center space-x-4'>
          <Link href='/login' className='py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100'>
            Login
          </Link>
          <Link href='/signup' className='py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800'>
            Signup
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
