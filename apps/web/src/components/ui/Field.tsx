import { ReactNode, useId } from 'react'

/** Estilo base de inputs/selects, sem largura (para controles em linha). */
export const inputBase =
  'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:bg-gray-100 disabled:text-gray-500'

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
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}
