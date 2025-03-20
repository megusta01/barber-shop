import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const refreshToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`, null, {
      headers: {
        'X-Refresh-Token': localStorage.getItem('refreshToken'),
      },
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    refreshSubscribers.forEach((callback) => callback(accessToken))
    refreshSubscribers = []

    return accessToken
  } catch (error) {
    console.error('Erro ao renovar token:', error)
    logout()
    return null
  } finally {
    isRefreshing = false
  }
}

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken')

    if (!token) {
      token = await refreshToken()
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      console.log('Token expirado, tentando refresh...');
      if (!isRefreshing) {
        isRefreshing = true

        const newAccessToken = await refreshToken()
        if (newAccessToken) {
          originalRequest._retry = true
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        }
      }

      return new Promise((resolve) => {
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequest))
        })
      })
    }

    return Promise.reject(error)
  }
)

export const loginWithGoogle = () => {
  const params = new URLSearchParams({
    prompt: 'select_account',
    access_type: 'offline',
  }).toString()

  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google?${params}`
}

export const logout = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export default api
