import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "@/db";
import type { Logger as DrizzleLogger } from "drizzle-orm/logger";
import { Logger } from "./logger";

class CustomDrizzleLogger implements DrizzleLogger {
	logQuery(query: string, params: unknown[]): void {
		Logger.getInstance("debug").debug("SQL Query", {
			query,
			params: JSON.stringify(params),
		});
	}
}

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
			logger: new CustomDrizzleLogger(),
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
