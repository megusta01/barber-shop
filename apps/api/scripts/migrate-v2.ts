/**
 * Migra um banco da versão anterior para o formato atual. Pode rodar mais de uma vez.
 *
 *   npm run migrate:v2 -w @barbearia/api
 *
 * - appointments: `costumer` → `customer`, `barberId` → `barber`
 * - appointments: preenche `slotKey` dos agendamentos ativos (trava de horário)
 * - users: preenche `isActive`, `role`, `phone`, `description` quando ausentes
 */
import mongoose from 'mongoose'

const ACTIVE = ['pending', 'confirmed']

async function main() {
  try {
    process.loadEnvFile?.('.env')
  } catch {
    // sem .env: usa as variáveis do ambiente
  }
  const uri = process.env.MONGO_URL
  if (!uri) throw new Error('MONGO_URL não definida')

  await mongoose.connect(uri)
  const db = mongoose.connection.db
  if (!db) throw new Error('Sem conexão com o banco')

  const appointments = db.collection('appointments')
  const users = db.collection('users')

  const renamed = await appointments.updateMany(
    { $or: [{ costumer: { $exists: true } }, { barberId: { $exists: true } }] },
    { $rename: { costumer: 'customer', barberId: 'barber' } },
  )
  console.log(`appointments renomeados: ${renamed.modifiedCount}`)

  let locked = 0
  const duplicates: string[] = []
  const seen = new Set<string>()
  const cursor = appointments
    .find({ status: { $in: ACTIVE }, slotKey: { $exists: false } })
    .sort({ createdAt: 1 })

  for await (const doc of cursor) {
    const key = `${String(doc.barber)}:${new Date(doc.date).toISOString()}`
    const taken = seen.has(key) || (await appointments.countDocuments({ slotKey: key })) > 0
    if (taken) {
      duplicates.push(String(doc._id))
      continue
    }
    seen.add(key)
    await appointments.updateOne({ _id: doc._id }, { $set: { slotKey: key } })
    locked++
  }
  console.log(`slotKey preenchido: ${locked}`)
  if (duplicates.length) {
    console.warn(
      `Agendamentos ativos duplicados no mesmo horário (mantido o mais antigo): ${duplicates.join(', ')}`,
    )
  }

  await appointments.createIndex({ slotKey: 1 }, { unique: true, sparse: true })

  const defaults: Record<string, unknown> = {
    isActive: true,
    role: 'client',
    phone: '',
    description: '',
  }
  for (const [field, value] of Object.entries(defaults)) {
    const res = await users.updateMany(
      { [field]: { $exists: false } },
      { $set: { [field]: value } },
    )
    if (res.modifiedCount) console.log(`users.${field} preenchido: ${res.modifiedCount}`)
  }

  await mongoose.disconnect()
  console.log('Migração concluída.')
}

main().catch(async (err) => {
  console.error(err)
  await mongoose.disconnect()
  process.exit(1)
})
