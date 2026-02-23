import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Uses the HTTP driver — no persistent connections, works with Vercel serverless.
// For operations requiring transactions, use the WebSocket driver instead:
//   import { Pool } from '@neondatabase/serverless'
//   import { drizzle } from 'drizzle-orm/neon-serverless'
const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql, { schema })

export type DB = typeof db
