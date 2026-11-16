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
        className="rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    )
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700"
    >
      {initials}
    </span>
  )
}
