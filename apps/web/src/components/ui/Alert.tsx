import { ReactNode } from 'react'

const TONES = {
  error: 'bg-red-50 text-red-700 ring-red-200',
  success: 'bg-green-50 text-green-700 ring-green-200',
  info: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}

export function Alert({
  tone = 'error',
  children,
}: {
  tone?: keyof typeof TONES
  children: ReactNode
}) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-md px-4 py-3 text-sm ring-1 ${TONES[tone]}`}
    >
      {children}
    </div>
  )
}
