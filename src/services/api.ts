import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

// Interceptor para adicionar o token de acesso a todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const loginWithGoogle = () => {
  const params = new URLSearchParams({
    prompt: 'select_account',  // Força a mostrar a tela de seleção de conta
    access_type: 'offline',    // Necessário para refresh token
  }).toString()
  
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?${params}`
}

export const refreshToken = async () => {
  try {
    const refreshTokenStored = localStorage.getItem('refreshToken')
    const response = await api.post('/auth/refresh-token', null, {
      headers: {
        'x-refresh-token': refreshTokenStored,
      },
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    throw error
  }
}

/**
 * Limpa os tokens armazenados no localStorage (logout).
 */
export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export default api
