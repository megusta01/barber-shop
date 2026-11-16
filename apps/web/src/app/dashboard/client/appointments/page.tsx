import { PageHeader } from '@/components/ui/PageHeader'
import { AppointmentsView } from '@/features/appointments/AppointmentsView'

export default function ClientAppointmentsPage() {
  return (
    <>
      <PageHeader title="Meus agendamentos" />
      <AppointmentsView viewer="client" />
    </>
  )
}
