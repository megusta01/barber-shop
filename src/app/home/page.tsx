'use client'

import Link from 'next/link'
import {
  CalendarDaysIcon,
  UserIcon,
  ScissorsIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gray-50">
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mb-6">
          Conectamos Clientes e Barbeiros com agilidade
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Agende cortes com poucos cliques e gerencie seus horários com facilidade. Uma plataforma inteligente para ambos os lados.
        </p>
        <Link
          href="/login"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-full text-lg transition"
        >
          Entrar na Plataforma
        </Link>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <ScissorsIcon className="w-10 h-10 text-indigo-600" />,
                title: 'Escolha seu barbeiro',
                desc: 'Veja perfis, horários e avaliações dos profissionais disponíveis.',
              },
              {
                icon: <CalendarDaysIcon className="w-10 h-10 text-indigo-600" />,
                title: 'Selecione o horário',
                desc: 'Agende rapidamente com base nas disponibilidades reais.',
              },
              {
                icon: <UserIcon className="w-10 h-10 text-indigo-600" />,
                title: 'Acompanhe seus agendamentos',
                desc: 'Tenha controle sobre seus cortes, horários e histórico.',
              },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div>{step.icon}</div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-gray-600 max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-12">
          <h2 className="text-3xl font-bold">Por que usar nossa plataforma?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-600">Para Clientes</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
                <li>Encontre barbeiros perto de você</li>
                <li>Agende em segundos, sem precisar ligar</li>
                <li>Visualize histórico e status de agendamentos</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-indigo-600">Para Barbeiros</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
                <li>Gerencie sua agenda com praticidade</li>
                <li>Ganhe visibilidade para novos clientes</li>
                <li>Organize seus horários e serviços facilmente</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Pronto para agilizar seus cortes?</h2>
          <p className="text-white/90 mb-8">Cadastre-se e comece a usar agora mesmo!</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full text-lg hover:bg-gray-100 transition"
          >
            Começar agora
            <ArrowRightCircleIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  )
}
