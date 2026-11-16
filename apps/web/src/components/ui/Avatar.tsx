import Image from 'next/image'

export function Avatar({ name, src, size = 40 }: { name: string; src?: string; size?: number }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  // só fotos do Google (host liberado no next.config); dados antigos podem ter valores inválidos
  if (src?.startsWith('https://lh3.googleusercontent.com/')) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover ring-1 ring-line"
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.max(12, size * 0.36) }}
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-charcoal font-display font-semibold text-brass-200"
    >
      {initials}
    </span>
  )
}
