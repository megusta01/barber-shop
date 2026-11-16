export const Role = {
  CLIENT: 'client',
  BARBER: 'barber',
  ADMIN: 'admin',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ROLES: readonly Role[] = Object.values(Role)

export const ROLE_LABELS: Record<Role, string> = {
  client: 'Cliente',
  barber: 'Barbeiro',
  admin: 'Administrador',
}
