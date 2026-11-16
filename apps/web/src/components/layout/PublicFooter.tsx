import Link from 'next/link'

export function PublicFooter({ className = '' }: { className?: string }) {
  return (
    <footer className={`py-6 text-center text-xs text-gray-500 ${className}`}>
      <Link href="/privacidade" className="hover:text-gray-700 hover:underline">
        Política de privacidade
      </Link>
    </footer>
  )
}
