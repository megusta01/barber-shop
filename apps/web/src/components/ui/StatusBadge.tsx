import { APPOINTMENT_STATUS_LABELS, AppointmentStatus } from '@barbearia/shared'

const COLORS: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  completed: 'bg-green-50 text-green-700 ring-green-200',
  cancelled: 'bg-gray-100 text-gray-600 ring-gray-200',
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${COLORS[status]}`}
    >
      {APPOINTMENT_STATUS_LABELS[status]}
    </span>
  )
}
