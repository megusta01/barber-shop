import { ReactNode } from 'react'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { RequireRole } from '@/lib/auth/RequireRole'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireRole>
      <DashboardShell>{children}</DashboardShell>
    </RequireRole>
  )
}
