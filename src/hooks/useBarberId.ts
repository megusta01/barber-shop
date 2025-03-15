'use client'
import { useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'

interface JwtPayload {
  id: string
  role: string
  // outros campos do payload, se houver
}

export function useBarberId() {
  const [barberId, setBarberId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken') // ou a key que você usa
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        // Valide se o user é barbeiro ou admin
        if (decoded.role === 'barber' || decoded.role === 'admin')
        setBarberId(decoded.id)
      } catch (error) {
        console.error('Erro ao decodificar JWT:', error)
      }
    }
  }, [])

  return barberId
}
