import type { Types } from 'mongoose'

type IdLike = string | Types.ObjectId | { toString(): string } | null | undefined

/** Compara ids do Mongo independente de virem como string ou ObjectId. */
export const sameId = (a: IdLike, b: IdLike): boolean =>
  a != null && b != null && a.toString() === b.toString()
