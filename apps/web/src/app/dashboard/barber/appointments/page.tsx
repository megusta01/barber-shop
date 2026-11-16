import { PageHeader } from '@/components/ui/PageHeader'
import { AppointmentsView } from '@/features/appointments/AppointmentsView'

export default function BarberAppointmentsPage() {
  return (
    <>
      <PageHeader title="Agendamentos" description="Confirme, conclua ou cancele atendimentos." />
      <AppointmentsView viewer="barber" />
    </>
  )
}
