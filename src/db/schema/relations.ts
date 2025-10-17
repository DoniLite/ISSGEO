import { relations } from "drizzle-orm";
import { KeyCompetencyTable, TrainingTable } from "./training.schema";
import { ThematicTable } from "./thematic.schema";
import { TrainingSessionTable } from "./session.schema";

export const TrainingTableRelations = relations(
	TrainingTable,
	({ many, one }) => ({
		thematic: one(ThematicTable, {
			fields: [TrainingTable.thematicId],
			references: [ThematicTable.id],
		}),
		sessions: many(TrainingSessionTable),
		competences: many(KeyCompetencyTable),
	}),
);

export const ThematicTableRelations = relations(ThematicTable, ({ many }) => ({
	modules: many(TrainingTable),
}));

export const TrainingSessionTableRelations = relations(
	TrainingSessionTable,
	({ one }) => ({
		module: one(TrainingTable, {
			fields: [TrainingSessionTable.moduleId],
			references: [TrainingTable.id],
		}),
	}),
);

export const KeyCompetencesTableRelations = relations(
	KeyCompetencyTable,
	({ one }) => ({
		module: one(TrainingTable, {
			fields: [KeyCompetencyTable.moduleId],
			references: [TrainingTable.id],
		}),
	}),
);
