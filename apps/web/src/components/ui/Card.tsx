import { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 ${className}`}>
      {children}
    </section>
  )
}
