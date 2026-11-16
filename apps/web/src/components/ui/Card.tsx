import { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  as: Tag = 'section',
}: {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}) {
  return (
    <Tag className={`rounded-xl border border-line bg-white p-5 sm:p-6 ${className}`}>
      {children}
    </Tag>
  )
}

export function CardTitle({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{children}</h2>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
    </div>
  )
}
