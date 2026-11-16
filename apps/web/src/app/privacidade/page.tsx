import type { Metadata } from 'next'
import Link from 'next/link'
import { ReactNode } from 'react'

import { LEGAL } from '@/lib/legal'

export const metadata: Metadata = { title: 'Política de privacidade' }

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export default function PrivacyPage() {
  const contact = LEGAL.contactEmail ? (
    <a href={`mailto:${LEGAL.contactEmail}`} className="font-medium text-brass-700 underline">
      {LEGAL.contactEmail}
    </a>
  ) : (
    'o canal de atendimento da barbearia'
  )

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 leading-relaxed text-ink">
      <Link href="/" className="text-sm font-medium text-brass-700 hover:text-charcoal">
        ← Voltar ao início
      </Link>

      <h1 className="mb-2 mt-6 font-display text-4xl font-semibold tracking-tight">
        Política de privacidade
      </h1>
      <p className="mb-10 text-muted">Atualizada em {LEGAL.updatedAt}.</p>

      <div className="space-y-10">
        <Section title="1. Quem somos">
          <p>
            Este app de agendamento de barbearia é mantido por {LEGAL.controllerName}, responsável
            pelo tratamento dos seus dados pessoais nos termos da Lei Geral de Proteção de Dados
            (Lei nº 13.709/2018). Para qualquer assunto sobre seus dados, fale com a gente por{' '}
            {contact}.
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Da sua conta Google</strong>, ao entrar com o Google: nome, endereço de
              e-mail, foto de perfil e o identificador da conta. Pedimos apenas as permissões
              básicas de perfil e e-mail; não acessamos seus e-mails, arquivos, contatos ou agenda
              do Google.
            </li>
            <li>
              <strong>Informados por você</strong>: telefone e, no caso de barbeiros, uma breve
              descrição profissional.
            </li>
            <li>
              <strong>Gerados pelo uso</strong>: agendamentos (data e hora, serviço, barbeiro,
              status e se foi pago) e os horários disponibilizados pelos barbeiros.
            </li>
          </ul>
        </Section>

        <Section title="3. Para que usamos">
          <ul className="list-disc space-y-2 pl-5">
            <li>Identificar você e manter sua sessão no app.</li>
            <li>Criar, mostrar e gerenciar seus agendamentos.</li>
            <li>Permitir que a barbearia entre em contato sobre seus atendimentos.</li>
          </ul>
          <p>
            Usamos esses dados para prestar o serviço que você solicitou (art. 7º, V, da LGPD). Não
            vendemos seus dados, não os usamos para publicidade e não criamos perfis de marketing.
          </p>
        </Section>

        <Section title="4. Com quem compartilhamos">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Dentro do app</strong>: o barbeiro vê o nome dos clientes que agendaram com
              ele; os clientes veem nome, foto e descrição dos barbeiros; administradores da
              barbearia veem os dados de contato dos usuários.
            </li>
            <li>
              <strong>Fornecedores de infraestrutura</strong>, que processam os dados apenas para
              operar o app: Google (login), MongoDB Atlas (banco de dados), Render (servidor) e
              Vercel (site). Esses serviços podem armazenar dados fora do Brasil, inclusive nos
              Estados Unidos, com as salvaguardas previstas em seus contratos.
            </li>
            <li>Autoridades públicas, quando houver obrigação legal.</li>
          </ul>
        </Section>

        <Section title="5. Dados do Google">
          <p>
            O uso e a transferência das informações recebidas das APIs do Google seguem a{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="font-medium text-brass-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              Política de Dados do Usuário dos Serviços de API do Google
            </a>
            , incluindo os requisitos de uso limitado.
          </p>
        </Section>

        <Section title="6. Armazenamento no navegador">
          <p>
            Para manter você conectado, guardamos tokens de sessão no armazenamento local do seu
            navegador. Não usamos cookies de rastreamento nem ferramentas de publicidade. Ao clicar
            em Sair, os tokens são apagados.
          </p>
        </Section>

        <Section title="7. Por quanto tempo guardamos">
          <p>
            Mantemos seus dados enquanto sua conta existir. Quando a conta é excluída, apagamos o
            seu cadastro, os seus agendamentos e, no caso de barbeiros, a sua agenda.
          </p>
        </Section>

        <Section title="8. Seus direitos">
          <p>
            Você pode, a qualquer momento, pedir confirmação e acesso aos seus dados, correção,
            exclusão da conta, informações sobre compartilhamento e revogação do consentimento. Nome
            e telefone podem ser corrigidos direto na página Perfil do app. Para os demais pedidos,
            escreva para {contact}. Você também pode reclamar à Autoridade Nacional de Proteção de
            Dados (ANPD).
          </p>
        </Section>

        <Section title="9. Segurança">
          <p>
            As conexões usam HTTPS, o acesso ao banco é protegido por usuário e senha, e cada pessoa
            só acessa o que o seu papel permite. Nenhum sistema é totalmente imune a falhas; se
            ocorrer um incidente que traga risco a você, avisaremos conforme a lei.
          </p>
        </Section>

        <Section title="10. Mudanças nesta política">
          <p>
            Podemos atualizar esta política. A data no topo indica a versão em vigor; mudanças
            relevantes serão avisadas no app.
          </p>
        </Section>
      </div>
    </main>
  )
}
