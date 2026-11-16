import {
  ArrowRightCircleIcon,
  CalendarDaysIcon,
  ScissorsIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

import { PublicFooter } from '@/components/layout/PublicFooter'

const STEPS = [
  {
    icon: ScissorsIcon,
    title: 'Escolha seu barbeiro',
    desc: 'Veja os profissionais da casa e os horários livres de cada um.',
  },
  {
    icon: CalendarDaysIcon,
    title: 'Selecione o horário',
    desc: 'Agende rapidamente com base nas disponibilidades reais.',
  },
  {
    icon: UserIcon,
    title: 'Acompanhe seus agendamentos',
    desc: 'Tenha controle sobre seus cortes, horários e histórico.',
  },
]

const BENEFITS = [
  {
    title: 'Para clientes',
    items: [
      'Veja os horários livres de cada barbeiro',
      'Agende em segundos, sem precisar ligar',
      'Visualize histórico e status de agendamentos',
    ],
  },
  {
    title: 'Para barbeiros',
    items: [
      'Gerencie sua agenda com praticidade',
      'Abra vários horários de uma vez',
      'Confirme e conclua atendimentos com um clique',
    ],
  },
]

export function LandingPage() {
  return (
    <main className="bg-white text-gray-800">
      <section className="flex flex-col items-center justify-center bg-gray-50 px-4 py-20 text-center">
        <Image src="/logo.png" alt="Barbershop" width={160} height={160} priority />
        <h1 className="mb-6 mt-6 max-w-3xl text-4xl font-bold md:text-5xl">
          Conectamos clientes e barbeiros com agilidade
        </h1>
        <p className="mb-8 max-w-xl text-lg text-gray-600">
          Agende cortes com poucos cliques e gerencie seus horários com facilidade. Uma plataforma
          inteligente para ambos os lados.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-indigo-500"
        >
          Entrar na plataforma
        </Link>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-12 text-3xl font-bold">Como funciona</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center space-y-4">
                <Icon className="h-10 w-10 text-indigo-600" />
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="max-w-xs text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4">
          <h2 className="text-center text-3xl font-bold">Por que usar nossa plataforma?</h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {BENEFITS.map(({ title, items }) => (
              <div key={title} className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-600">{title}</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-3xl font-bold">Pronto para agilizar seus cortes?</h2>
          <p className="mb-8 text-white/90">Entre com sua conta Google e comece agora mesmo.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-lg font-semibold text-indigo-600 transition hover:bg-gray-100"
          >
            Começar agora
            <ArrowRightCircleIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
