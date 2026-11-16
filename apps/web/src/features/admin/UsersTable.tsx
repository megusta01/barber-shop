'use client'

import { Role, ROLE_LABELS, ROLES, UserDto } from '@barbearia/shared'
import { MagnifyingGlassIcon, TrashIcon, UsersIcon } from '@heroicons/react/24/outline'
import { useCallback, useState } from 'react'

import { Alert } from '@/components/ui/Alert'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { inputBase } from '@/components/ui/Field'
import { Skeleton, Spinner } from '@/components/ui/Spinner'
import { useAsync } from '@/hooks/useAsync'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { usersApi } from '@/lib/api/endpoints'
import { errorMessage } from '@/lib/api/errors'
import { useSession } from '@/lib/auth/AuthProvider'

const PAGE_SIZE = 20

/** Interruptor acessível (role="switch") para ativar/desativar contas. */
function Switch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean
  disabled?: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-charcoal' : 'bg-line'
      }`}
    >
      <span
        aria-hidden
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

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
    const note =
      next === 'barber'
        ? ' Ele vai poder abrir horários e receber agendamentos.'
        : next === 'admin'
          ? ' Ele vai poder gerenciar todos os usuários.'
          : ''
    if (window.confirm(`Mudar ${user.displayName} para ${ROLE_LABELS[next]}?${note}`)) {
      void run(user, () => usersApi.updateRole(user.id, next))
    }
  }

  const toggleActive = (user: UserDto) => {
    const ok =
      user.isActive === false ||
      window.confirm(`Desativar ${user.displayName}? A pessoa não vai conseguir entrar no app.`)
    if (ok) void run(user, () => usersApi.update(user.id, { isActive: !user.isActive }))
  }

  const remove = (user: UserDto) => {
    const ok = window.confirm(
      `Excluir ${user.displayName}? Os agendamentos e os horários dessa pessoa também serão apagados. Não dá para desfazer.`,
    )
    if (ok) void run(user, async () => void (await usersApi.remove(user.id)))
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const roleSelect = (user: UserDto, isSelf: boolean) => (
    <select
      aria-label={`Função de ${user.displayName}`}
      value={user.role}
      disabled={isSelf || busyId === user.id}
      onChange={(e) => changeRole(user, e.target.value as Role)}
      className={`${inputBase} h-9`}
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>
          {ROLE_LABELS[r]}
        </option>
      ))}
    </select>
  )

  const deleteButton = (user: UserDto) => (
    <button
      type="button"
      onClick={() => remove(user)}
      disabled={busyId === user.id}
      aria-label={`Excluir ${user.displayName}`}
      className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <MagnifyingGlassIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Buscar por nome ou e-mail"
            aria-label="Buscar usuários"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className={`${inputBase} w-full pl-9`}
          />
        </div>
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
        {loading && data && <Spinner className="h-4 w-4 text-muted" />}
      </div>

      {(error || actionError) && <Alert>{error ?? actionError}</Alert>}

      {loading && !data && (
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}

      {data && data.items.length === 0 && (
        <EmptyState icon={UsersIcon} title="Ninguém encontrado">
          Confira a busca ou o filtro de função.
        </EmptyState>
      )}

      {data && data.items.length > 0 && (
        <>
          {/* celular: um card por pessoa */}
          <ul className="space-y-3 md:hidden">
            {data.items.map((user) => {
              const isSelf = user.id === session.userId
              return (
                <li key={user.id} className="rounded-xl border border-line bg-white p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={user.displayName} src={user.avatarUrl} size={40} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">
                        {user.displayName} {isSelf && <span className="text-muted">(você)</span>}
                      </p>
                      <p className="truncate text-sm text-muted">{user.email}</p>
                      {user.phone && <p className="text-sm text-muted">{user.phone}</p>}
                    </div>
                    {!isSelf && deleteButton(user)}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-dashed border-line pt-4">
                    {roleSelect(user, isSelf)}
                    <label className="flex items-center gap-2 text-sm text-muted">
                      Ativo
                      <Switch
                        checked={user.isActive}
                        disabled={isSelf || busyId === user.id}
                        onChange={() => toggleActive(user)}
                        label={`${user.displayName} ativo`}
                      />
                    </label>
                  </div>
                </li>
              )
            })}
          </ul>

          {/* desktop: tabela */}
          <div className="hidden overflow-hidden rounded-xl border border-line bg-white md:block">
            <table className="min-w-full text-sm">
              <thead className="border-b border-line bg-paper text-left text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Pessoa</th>
                  <th className="px-5 py-3 font-medium">Telefone</th>
                  <th className="px-5 py-3 font-medium">Função</th>
                  <th className="px-5 py-3 font-medium">Ativo</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.items.map((user) => {
                  const isSelf = user.id === session.userId
                  return (
                    <tr key={user.id} className={user.isActive ? '' : 'bg-paper/60 text-muted'}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.displayName} src={user.avatarUrl} size={36} />
                          <div>
                            <p className="font-semibold text-ink">
                              {user.displayName}{' '}
                              {isSelf && <span className="font-normal text-muted">(você)</span>}
                            </p>
                            <p className="text-xs text-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 tabular-nums">{user.phone || '—'}</td>
                      <td className="px-5 py-3">{roleSelect(user, isSelf)}</td>
                      <td className="px-5 py-3">
                        <Switch
                          checked={user.isActive}
                          disabled={isSelf || busyId === user.id}
                          onChange={() => toggleActive(user)}
                          label={`${user.displayName} ativo`}
                        />
                      </td>
                      <td className="px-5 py-3 text-right">{!isSelf && deleteButton(user)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted">
          <span>
            Página {page} de {totalPages}, {data.total} pessoas
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
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
