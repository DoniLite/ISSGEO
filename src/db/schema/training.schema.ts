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
	masterId: T.text("master_id").references(() => MasterTable.id),
});

export const KeyCompetencyTable = pgTable("Key_competency", {
	...BaseRow,
	title: T.text("title").notNull(),
	description: T.text("description").notNull(),
	icon: T.text("icon").notNull(),
	sectors: T.text("sectors").array(),
	advantages: T.text("advantages").array(),
});

export const ModuleTable = pgTable("Module", {
	...BaseRow,
	title: T.text("title").notNull(),
	price: T.integer("price").notNull(),
	duration: T.integer("duration").notNull(),
});

export const TrainingToModuleTable = pgTable("Training_to_module", {
	...BaseRow,
	trainingId: T.text("training_id")
		.notNull()
		.references(() => TrainingTable.id, { onDelete: "cascade" }),
	moduleId: T.text("module_id")
		.notNull()
		.references(() => ModuleTable.id, { onDelete: "cascade" }),
});

export const TrainingToKeyCompetencyTable = pgTable(
	"Training_to_key_competency",
	{
		...BaseRow,
		trainingId: T.text("training_id")
			.notNull()
			.references(() => TrainingTable.id, { onDelete: "cascade" }),
		competencyId: T.text("competency_id")
			.notNull()
			.references(() => KeyCompetencyTable.id, { onDelete: "cascade" }),
	},
);

export const MasterTable = pgTable("Master", {
	...BaseRow,
	name: T.text("name").notNull(),
	description: T.text("description"),
	image: T.text("image"),
	socials: T.json("socials"),
});
