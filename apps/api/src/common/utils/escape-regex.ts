/** Escapa caracteres especiais para usar texto do usuário dentro de um RegExp. */
export const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
