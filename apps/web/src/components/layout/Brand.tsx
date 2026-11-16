import Image from 'next/image'
import Link from 'next/link'

export const APP_NAME = 'Barbearia'

/** Logo + nome. `inverted` para fundos escuros. */
export function Brand({ href, inverted = false }: { href: string; inverted?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg">
      {/* o desenho tem uma placa preta: no fundo escuro ele vai num selo claro */}
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${inverted ? 'bg-paper' : ''}`}
      >
        <Image
          src="/logo.png"
          alt=""
          width={inverted ? 30 : 36}
          height={inverted ? 30 : 36}
          priority
        />
      </span>
      <span
        className={`font-display text-xl font-semibold tracking-tight ${inverted ? 'text-paper' : 'text-charcoal'}`}
      >
        {APP_NAME}
      </span>
    </Link>
  )
}
