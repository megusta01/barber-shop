import { PageHeader } from '@/components/ui/PageHeader'
import { UsersTable } from '@/features/admin/UsersTable'

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader
        title="Usuários"
        description="Defina quem é barbeiro, desative contas e remova usuários."
      />
      <UsersTable />
    </>
  )
}
