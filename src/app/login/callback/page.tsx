'use client'

import { Suspense } from 'react'
import { GoogleCallbackContent } from '@/components/auth/GoogleCallback'

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  )
}