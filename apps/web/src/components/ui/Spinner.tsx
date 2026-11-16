export function Spinner({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent opacity-70 ${className}`}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center text-muted">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

/** Bloco cinza pulsante no formato do conteúdo que está carregando. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-line/60 ${className}`} />
}
