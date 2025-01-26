'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AppointmentsPage = () => {
  const router = useRouter()

  useEffect(() => {
    // Simulação: Pegue o perfil do usuário
    const userProfile = localStorage.getItem('userProfile') // "barber" ou "customer"

    if (userProfile === 'barber') {
      router.replace('/barber') // Redireciona para a tela do barbeiro
    } else if (userProfile === 'customer') {
      router.replace('/customer') // Redireciona para a tela do cliente
    } else {
      router.replace('/login') // Redireciona para o login se o perfil não estiver definido
    }
  }, [router])

  return <div>Redirecionando...</div>
}

export default AppointmentsPage
