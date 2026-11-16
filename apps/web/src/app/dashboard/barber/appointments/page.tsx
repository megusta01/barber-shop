import { PageHeader } from '@/components/ui/PageHeader'
import { AppointmentsView } from '@/features/appointments/AppointmentsView'

export default function BarberAppointmentsPage() {
  return (
    <>
      <PageHeader
        title="Agendamentos"
        description="Confirme quem vai vir, conclua o que já foi feito e marque o que foi pago."
      />
      <AppointmentsView viewer="barber" />
    </>
  )
}
