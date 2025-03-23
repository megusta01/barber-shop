import React from 'react'
import { User } from './AdminPanel'

interface UserRowProps {
  user: User
  onRoleChange: (userId: string, newRole: 'client' | 'barber') => void
}

export default function UserRow({ user, onRoleChange }: UserRowProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'client' | 'barber'
    onRoleChange(user._id, newRole)
  }

  return (
    <tr>
      <td className="px-4 py-2 text-gray-800">{user.displayName}</td>
      <td className="px-4 py-2 text-gray-600">{user.email}</td>
      <td className="px-4 py-2">
        {user.role === 'admin' ? (
          <span className="text-gray-500">Administrador</span>
        ) : (
          <select
            value={user.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            <option value="client">Cliente</option>
            <option value="barber">Barbeiro</option>
          </select>
        )}
      </td>
    </tr>
  )
}
