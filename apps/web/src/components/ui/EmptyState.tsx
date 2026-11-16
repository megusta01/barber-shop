import type { ComponentType, ReactNode, SVGProps } from 'react'

export function EmptyState({
  title,
  children,
  icon: Icon,
  action,
}: {
  title: string
  children?: ReactNode
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-brass-500" aria-hidden />}
      <p className="font-medium text-ink">{title}</p>
      {children && <div className="mt-1 max-w-sm text-sm text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
