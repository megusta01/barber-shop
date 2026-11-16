import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Página não encontrada</h1>
      <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Voltar ao início
      </Link>
    </main>
  )
}
