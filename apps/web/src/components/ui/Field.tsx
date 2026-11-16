import { ReactNode, useId } from 'react'

/** Estilo base de inputs/selects, sem largura (para controles em linha). */
export const inputBase =
  'h-10 rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-muted/70 transition-colors hover:border-muted/50 focus:border-brass-500 focus:outline-none focus:ring-2 focus:ring-brass-500/25 disabled:cursor-not-allowed disabled:bg-paper disabled:text-muted'

/** Input de formulário ocupando a largura toda. */
export const inputClass = `${inputBase} w-full`

/** Label + controle + texto de ajuda. O controle recebe o `id` via render prop. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: (id: string) => ReactNode
}) {
  const id = useId()
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}
