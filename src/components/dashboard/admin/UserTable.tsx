import React from 'react'
import UserRow from './UserRow'
import { User } from './AdminPanel'

interface UserTableProps {
  users: User[]
  onRoleChange: (userId: string, newRole: 'client' | 'barber') => void
}

export default function UserTable({ users, onRoleChange }: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-2 font-medium">Nome</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Função</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <UserRow key={user._id} user={user} onRoleChange={onRoleChange} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
