'use client'
import { useState, useEffect } from 'react'
import {jwtDecode} from 'jwt-decode'

interface JwtPayload {
  id: string
  role: string
}

export function useBarberId() {
  const [barberId, setBarberId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        if (decoded.role === 'barber' || decoded.role === 'admin')
        setBarberId(decoded.id)
      } catch (error) {
        console.error('Erro ao decodificar JWT:', error)
      }
    }
  }, [])

  return barberId
}
