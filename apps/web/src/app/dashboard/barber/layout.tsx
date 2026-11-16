import { ReactNode } from 'react'

import { RequireRole } from '@/lib/auth/RequireRole'

export default function Layout({ children }: { children: ReactNode }) {
  return <RequireRole roles={['barber']}>{children}</RequireRole>
}
