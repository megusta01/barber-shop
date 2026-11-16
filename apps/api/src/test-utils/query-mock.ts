/**
 * Simula a cadeia de query do Mongoose (`find().sort().lean().exec()` etc.) resolvendo `result`.
 */
export function queryMock<T>(result: T) {
  const chain: Record<string, jest.Mock> = {}
  for (const method of ['sort', 'skip', 'limit', 'lean', 'populate', 'select']) {
    chain[method] = jest.fn(() => chain)
  }
  chain.exec = jest.fn().mockResolvedValue(result)
  return chain
}

export const oid = (n: number): string => n.toString(16).padStart(24, '0')
