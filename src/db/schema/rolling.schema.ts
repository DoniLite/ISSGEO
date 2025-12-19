import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { ModuleTable, TrainingTable } from "./training.schema";

export const RollingTable = pgTable("Rolling", {
	...BaseRow,
	name: T.text("name").notNull(),
	contact: T.text("contact").notNull(),
	country: T.text("country"),
	profession: T.text("profession"),
	schoolLevel: T.text("school_level"),
	experience: T.text("experience"),
	courseId: T.text("course_id").references(() => TrainingTable.id, {
		onDelete: "cascade",
	}),
});

export const RollingToModuleTable = pgTable("Rolling_to_module", {
	...BaseRow,
	moduleId: T.text("module_id").references(() => ModuleTable.id, {
		onDelete: "cascade",
	}),
	rollingId: T.text("rolling_id").references(() => RollingTable.id, {
		onDelete: "cascade",
	}),
});
