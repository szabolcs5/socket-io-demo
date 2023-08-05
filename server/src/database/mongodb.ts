import { MongoClient } from 'mongodb'

const DB = 'socketio'
const COLLECTION = 'sessions'

const mongoClient = new MongoClient('mongodb://localhost:27017')

export async function main() {
  await mongoClient.connect()

  try {
    await mongoClient.db(DB).createCollection(COLLECTION, {
      capped: true,
      size: 1e6,
    })
  } catch (e) {
    console.log(`Collection ${COLLECTION} already exists`)
  }
  return mongoClient.db(DB).collection(COLLECTION)
}
