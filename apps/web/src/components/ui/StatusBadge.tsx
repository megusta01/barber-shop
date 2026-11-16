import { APPOINTMENT_STATUS_LABELS, AppointmentStatus } from '@barbearia/shared'

const STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-brass-100 text-brass-700',
  confirmed: 'bg-charcoal text-paper',
  completed: 'bg-emerald-50 text-emerald-800',
  cancelled: 'bg-line/60 text-muted',
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  )
}

export function PaidBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
      Pago
    </span>
  )
}
