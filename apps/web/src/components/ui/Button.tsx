import { ButtonHTMLAttributes, forwardRef } from 'react'

import { Spinner } from './Spinner'

type Variant = 'primary' | 'accent' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-charcoal text-paper hover:bg-charcoal-700 active:bg-charcoal-800',
  accent: 'bg-brass-500 text-charcoal hover:bg-brass-600 hover:text-paper',
  secondary: 'border border-line bg-white text-ink hover:border-muted/50 hover:bg-paper',
  danger: 'border border-red-200 bg-white text-red-700 hover:border-red-300 hover:bg-red-50',
  ghost: 'text-ink hover:bg-charcoal/5',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', extra = '') =>
  `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${extra}`

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
})
