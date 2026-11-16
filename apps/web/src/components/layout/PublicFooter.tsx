import Link from 'next/link'

export function PublicFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`text-xs text-muted ${className}`}>
      <Link href="/privacidade" className="rounded hover:text-ink hover:underline">
        Política de privacidade
      </Link>
    </footer>
  )
}
