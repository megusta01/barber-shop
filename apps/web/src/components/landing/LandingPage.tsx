import {
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

import { Brand } from '@/components/layout/Brand'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { buttonClass } from '@/components/ui/Button'

const STEPS = [
  {
    title: 'Escolha o barbeiro',
    desc: 'Veja quem atende na casa e o estilo de cada um antes de decidir.',
  },
  {
    title: 'Pegue um horário livre',
    desc: 'Só aparecem horários que o barbeiro abriu e que ninguém reservou.',
  },
  {
    title: 'Confirme o serviço',
    desc: 'Corte, barba ou os dois. O barbeiro vê o agendamento na hora.',
  },
]

const BARBER_FEATURES = [
  { icon: ClockIcon, text: 'Abra a semana inteira de horários em poucos cliques.' },
  { icon: CalendarDaysIcon, text: 'Veja o dia em uma tela: quem vem, a que horas e o quê.' },
  { icon: CheckIcon, text: 'Confirme e conclua atendimentos com um toque.' },
  { icon: CurrencyDollarIcon, text: 'Marque o que já foi pago e não perca a conta.' },
]

/** Bilhete de exemplo no hero: mostra o produto em vez de descrevê-lo. */
function TicketPreview() {
  return (
    <div
      aria-hidden
      className="w-full max-w-sm rounded-2xl bg-paper p-5 text-charcoal shadow-2xl shadow-black/40"
    >
      <p className="mb-4 text-sm font-semibold text-muted">Seu próximo horário</p>
      <div className="flex items-center gap-4">
        <div className="flex w-16 flex-col items-center border-r border-dashed border-brass-200 pr-4 leading-none">
          <span className="text-xs font-medium text-muted">sáb</span>
          <span className="font-display text-4xl font-semibold">22</span>
          <span className="text-xs font-medium text-muted">nov</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-semibold">Corte e barba</p>
          <p className="text-sm text-muted">às 10:00 com o seu barbeiro</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm text-muted">
        <span className="rounded-full bg-charcoal px-2.5 py-0.5 text-xs font-semibold text-paper">
          Confirmado
        </span>
        pelo barbeiro
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-charcoal text-paper">
        <div className="pole-stripe h-1.5" aria-hidden />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Brand href="/" inverted />
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-paper/90 hover:bg-white/10 hover:text-paper"
          >
            Entrar
          </Link>
        </header>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-10 md:grid-cols-[1.15fr_1fr] md:pb-28 md:pt-16">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-paper sm:text-6xl">
              Sua cadeira reservada, sem precisar ligar.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-300">
              Escolha o barbeiro, veja os horários livres de verdade e confirme em poucos toques. O
              barbeiro recebe o agendamento na mesma hora.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login" className={buttonClass('accent', 'lg')}>
                Agendar horário
              </Link>
              <Link
                href="/login"
                className={buttonClass(
                  'ghost',
                  'lg',
                  'border border-white/20 text-paper hover:bg-white/10',
                )}
              >
                Sou barbeiro
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <TicketPreview />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Do celular para a cadeira em três passos
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-display text-5xl font-semibold leading-none text-brass-500">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-muted">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Para quem está atrás da cadeira
            </h2>
            <p className="mt-4 max-w-md text-lg text-muted">
              A agenda do barbeiro sai do caderno e do WhatsApp e fica num lugar só, sempre
              atualizada.
            </p>
            <Link href="/login" className={buttonClass('primary', 'lg', 'mt-8')}>
              Entrar como barbeiro
            </Link>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {BARBER_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass-50 text-brass-700">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="pt-2 text-ink">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:flex-row sm:items-center">
        <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Próximo corte? Leva menos de um minuto.
        </p>
        <Link href="/login" className={buttonClass('primary', 'lg')}>
          Agendar horário
        </Link>
      </section>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
          <Brand href="/" />
          <PublicFooter />
        </div>
      </div>
    </div>
  )
}
