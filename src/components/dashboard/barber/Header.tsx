'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const Header: React.FC = () => {
  const [displayName, setDisplayName] = useState('Usuário')

  useEffect(() => {
    const storedName = localStorage.getItem('displayName')
    if (storedName) {
      setDisplayName(storedName)
    }
  }, [])

  return (
    <header className="flex justify-around items-center p-4 bg-gray-100 shadow-md">
      <div className="flex items-center">
        <Image src='/logo-barber-shop.png' alt="Logo" width={150} height={100} priority={true} />
      </div>
      <div>
        <nav>
          <ul>
            <li>
              Agendamentos
            </li>
            <li>
              Clientes
            </li>
            <li>
              Configurações
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <span className="text-lg font-medium">Olá, {displayName}</span>
      </div>
    </header>
  )
}

export default Header
