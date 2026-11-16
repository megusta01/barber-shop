import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid'
import { ReactNode } from 'react'

const TONES = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: ExclamationTriangleIcon },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: CheckCircleIcon },
  info: { box: 'border-brass-200 bg-brass-50 text-brass-700', icon: InformationCircleIcon },
}

export function Alert({
  tone = 'error',
  children,
  className = '',
}: {
  tone?: keyof typeof TONES
  children: ReactNode
  className?: string
}) {
  const { box, icon: Icon } = TONES[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${box} ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0">{children}</div>
    </div>
  )
}
