import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "@/db";
export class DatabaseConnection {
	private static instance: DatabaseConnection;
	private db;

	private constructor() {
		const pool = new Pool({
			connectionString: process.env.DATABASE_URL,
		});
		this.db = drizzle(pool, {
			schema: {
				...schemas,
			},
		});
	}

	static getInstance(): DatabaseConnection {
		if (!DatabaseConnection.instance) {
			DatabaseConnection.instance = new DatabaseConnection();
		}
		return DatabaseConnection.instance;
	}

	getDatabase() {
		return this.db;
	}
}
