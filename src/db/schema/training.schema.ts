import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { ThematicTable } from "./thematic.schema";

export const TrainingTable = pgTable("Training", {
	...BaseRow,
	title: T.text("title").notNull(),
	description: T.text("description").notNull(),
	totalDuration: T.integer("total_duration")
		.notNull()
		.$default(() => 0),
	priceMin: T.integer("price_min")
		.notNull()
		.$default(() => 0),
	priceMax: T.integer("price_max")
		.notNull()
		.$default(() => 0),
	participants: T.integer("participants").$default(() => 0),
	enrolled: T.integer("enrolled").$default(() => 0),
	thematicId: T.text("thematic").references(() => ThematicTable.id),
	learningOutcomes: T.text("learning_outcomes").array(),
	targetAudience: T.text("target_audience"),
});

export const KeyCompetencyTable = pgTable("Key_competency", {
	...BaseRow,
	title: T.text("title").notNull(),
	description: T.text("description").notNull(),
	icon: T.text("icon").notNull(),
	sectors: T.text("sectors").array(),
	advantages: T.text("advantages").array(),
	moduleId: T.text("module_id").references(() => TrainingTable.id),
});

export const ModuleTable = pgTable("Module", {
	...BaseRow,
	title: T.text("title").notNull(),
	price: T.integer("price").notNull(),
	duration: T.integer("duration").notNull(),
	courseId: T.text("course_id").references(() => TrainingTable.id),
});
