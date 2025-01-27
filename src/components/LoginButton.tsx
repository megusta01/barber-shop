'use client'
import React from 'react'

export default function LoginPage() {
  const handleGoogleLogin = () => {
    // Redireciona o navegador para a rota do Nest
    window.location.href = 'http://localhost:3000/auth/google'
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleLogin}>
        Login com Google
      </button>
    </div>
  )
}
