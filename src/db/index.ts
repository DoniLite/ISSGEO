import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL) {
    throw new Error('please provide a DATABASE_URL env');
}

export const db = drizzle(process.env.DATABASE_URL);
