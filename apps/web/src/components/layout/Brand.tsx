import Image from 'next/image'
import Link from 'next/link'

export const APP_NAME = 'Barbearia'

/** Logo + nome. `inverted` para fundos escuros (o desenho do logo é preto). */
export function Brand({ href, inverted = false }: { href: string; inverted?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg">
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className={inverted ? 'invert' : undefined}
        priority
      />
      <span
        className={`font-display text-xl font-semibold tracking-tight ${inverted ? 'text-paper' : 'text-charcoal'}`}
      >
        {APP_NAME}
      </span>
    </Link>
  )
}
