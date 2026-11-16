'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { ReactNode, useEffect, useId, useRef } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Diálogo centralizado no desktop e "folha" presa na base da tela no celular. */
export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panel.current?.focus()

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-charcoal/60 sm:items-center sm:px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-[92vh] w-full max-w-lg animate-rise-in overflow-y-auto rounded-t-2xl bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-lift focus:outline-none sm:rounded-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-2 -mt-1 rounded-lg p-2 text-muted hover:bg-charcoal/5 hover:text-ink"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
