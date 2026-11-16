import { PageHeader } from '@/components/ui/PageHeader'
import { AppointmentsView } from '@/features/appointments/AppointmentsView'

export default function AdminAppointmentsPage() {
  return (
    <>
      <PageHeader title="Agendamentos" description="Todos os agendamentos da barbearia." />
      <AppointmentsView viewer="admin" />
    </>
  )
}
