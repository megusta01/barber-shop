import React from 'react'

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/redirect`
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-4'>Login</h1>
        <button
          onClick={handleGoogleLogin}
          className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700'
        >
          Login com Google
        </button>
      </div>
    </div>
  )
}

export default Login
