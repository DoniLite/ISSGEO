import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { TrainingTable } from "./training.schema";

export const TrainingSessionTable = pgTable("Session", {
	...BaseRow,
	startDate: T.date("start_date").notNull(),
	location: T.text("location").notNull(),
	moduleId: T.text("module_id").references(() => TrainingTable.id),
});
