import { ErrorCode } from '@barbearia/shared'
import { isAxiosError } from 'axios'

const MESSAGES: Record<ErrorCode, string> = {
  USER_NOT_FOUND: 'Usuário não encontrado.',
  USER_INACTIVE: 'Sua conta está desativada. Fale com a barbearia.',
  BARBER_NOT_FOUND: 'Barbeiro não encontrado.',
  APPOINTMENT_NOT_FOUND: 'Agendamento não encontrado.',
  SLOT_UNAVAILABLE: 'Esse horário não está mais disponível.',
  SLOT_ALREADY_BOOKED: 'Alguém acabou de reservar esse horário. Escolha outro.',
  SLOT_IN_PAST: 'Escolha um horário no futuro.',
  SLOT_HAS_APPOINTMENT: 'Esse horário já tem agendamento e não pode ser removido.',
  STATUS_TRANSITION_NOT_ALLOWED: 'Essa mudança de status não é permitida.',
  CANNOT_CHANGE_OWN_ROLE: 'Você não pode alterar a sua própria função.',
  CANNOT_DELETE_SELF: 'Você não pode excluir a sua própria conta.',
  FORBIDDEN: 'Você não tem permissão para isso.',
  INVALID_TOKEN: 'Sua sessão expirou. Entre novamente.',
  INVALID_ID: 'Identificador inválido.',
}

/** Mensagem amigável para qualquer erro vindo da API. */
export function errorMessage(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.',
): string {
  if (!isAxiosError(error)) return fallback
  if (!error.response) return 'Não foi possível falar com o servidor. Verifique sua conexão.'

  const message = (error.response.data as { message?: unknown } | undefined)?.message
  if (typeof message === 'string' && message in MESSAGES) return MESSAGES[message as ErrorCode]
  if (Array.isArray(message)) return 'Confira os dados informados.'
  return fallback
}

/** Mensagem para o parâmetro `?error=` que a API manda para a tela de login. */
export const loginErrorMessage = (code: string | null): string | null => {
  if (!code) return null
  if (code in MESSAGES) return MESSAGES[code as ErrorCode]
  return 'Não foi possível entrar com o Google. Tente novamente.'
}
