'use client'

import { Role, ROLE_LABELS, ROLES, UserDto } from '@barbearia/shared'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { inputBase, inputClass } from '@/components/ui/Field'
import { Spinner } from '@/components/ui/Spinner'
import { useAsync } from '@/hooks/useAsync'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usersApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/AuthProvider'

const PAGE_SIZE = 20

export function UsersTable() {
  const session = useSession()
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<Role | ''>('')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const debouncedSearch = useDebouncedValue(search)

  const load = useCallback(
    () =>
      usersApi.list({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: role || undefined,
      }),
    [page, debouncedSearch, role],
  )
  const { data, error, loading, reload, setData } = useAsync(load)

  async function run(user: UserDto, action: () => Promise<UserDto | void>) {
    setBusyId(user.id)
    setActionError(null)
    try {
      const updated = await action()
      if (updated && data) {
        setData({ ...data, items: data.items.map((u) => (u.id === updated.id ? updated : u)) })
      } else {
        await reload()
      }
    } catch (err) {
      setActionError(errorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const changeRole = (user: UserDto, next: Role) => {
    if (window.confirm(`Mudar ${user.displayName} para ${ROLE_LABELS[next]}?`)) {
      void run(user, () => usersApi.updateRole(user.id, next))
    }
  }

  const toggleActive = (user: UserDto) =>
    void run(user, () => usersApi.update(user.id, { isActive: !user.isActive }))

  const remove = (user: UserDto) => {
    const ok = window.confirm(
      `Excluir ${user.displayName}? Os agendamentos e a agenda dessa pessoa também serão apagados.`,
    )
    if (ok) void run(user, async () => void (await usersApi.remove(user.id)))
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por nome ou e-mail"
          aria-label="Buscar usuários"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className={`${inputClass} max-w-xs`}
        />
        <select
          aria-label="Filtrar por função"
          value={role}
          onChange={(e) => {
            setRole(e.target.value as Role | '')
            setPage(1)
          }}
          className={inputBase}
        >
          <option value="">Todas as funções</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
        {loading && <Spinner className="h-5 w-5 self-center" />}
      </div>

      {(error || actionError) && <Alert>{error ?? actionError}</Alert>}

      {data && data.items.length === 0 && <EmptyState title="Nenhum usuário encontrado." />}

      {data && data.items.length > 0 && (
        <div className="overflow-x-auto rounded-lg ring-1 ring-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Usuário</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Função</th>
                <th className="px-4 py-3 font-medium">Ativo</th>
                <th className="px-4 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((user) => {
                const isSelf = user.id === session.userId
                const busy = busyId === user.id
                return (
                  <tr key={user.id} className={user.isActive ? '' : 'bg-gray-50 text-gray-500'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.displayName} src={user.avatarUrl} size={32} />
                        <div>
                          <p className="font-medium text-gray-900">{user.displayName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Função de ${user.displayName}`}
                        value={user.role}
                        disabled={isSelf || busy}
                        onChange={(e) => changeRole(user, e.target.value as Role)}
                        className={`${inputBase} py-1`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`${user.displayName} ativo`}
                        checked={user.isActive}
                        disabled={isSelf || busy}
                        onChange={() => toggleActive(user)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => remove(user)}
                          disabled={busy}
                          aria-label={`Excluir ${user.displayName}`}
                          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Página {page} de {totalPages} · {data.total} usuário(s)
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Anterior
            </Button>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
