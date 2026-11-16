/**
 * Dados do responsável exibidos na política de privacidade.
 * Defina na Vercel (e em .env.local) para não deixar dados pessoais no repositório.
 */
export const LEGAL = {
  controllerName: process.env.NEXT_PUBLIC_LEGAL_NAME?.trim() || 'o responsável por este app',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || '',
  updatedAt: '16 de novembro de 2026',
}
