import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { TrainingSessionTable } from "./session.schema";

export const RollingTable = pgTable("Rolling", {
	...BaseRow,
	name: T.text("name").notNull(),
	contact: T.text("contact").notNull(),
	country: T.text("country"),
	profession: T.text("profession"),
	schoolLevel: T.text("school_level"),
	experience: T.text("experience"),
	sessionId: T.text("session_id").references(() => TrainingSessionTable.id),
});
