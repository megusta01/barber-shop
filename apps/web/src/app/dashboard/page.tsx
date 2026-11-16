'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { FullPageSpinner } from '@/components/ui/Spinner'
import { useSession } from '@/lib/auth/AuthProvider'
import { homePathFor } from '@/lib/auth/session'

export default function DashboardIndex() {
  const { role } = useSession()
  const router = useRouter()
  useEffect(() => router.replace(homePathFor(role)), [role, router])
  return <FullPageSpinner />
}
