import { useEffect, useState } from 'react'
import api from '@/services/api'
import UserTable from './UserTable'

export interface User {
  _id: string
  displayName: string
  email: string
  role: 'client' | 'barber' | 'admin'
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/users')
        setUsers(response.data)
      } catch (err) {
        console.error(err)
        setError('Erro ao carregar usuários.')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: string, newRole: 'client' | 'barber') => {
    if (!window.confirm(`Deseja alterar a função deste usuário para ${newRole}?`)) return

    try {
      await api.patch(`/users/${userId}`, { role: newRole })
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role: newRole } : user))
      )
    } catch (err) {
      console.error(err)
      alert('Erro ao alterar a função.')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Painel de Administração</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando usuários...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <UserTable users={users} onRoleChange={handleRoleChange} />
      )}
    </div>
  )
}
