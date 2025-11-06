import { relations } from "drizzle-orm";
import {
	KeyCompetencyTable,
	ModuleTable,
	TrainingTable,
} from "./training.schema";
import { ThematicTable } from "./thematic.schema";
import { TrainingSessionTable } from "./session.schema";
import { RollingTable } from "./rolling.schema";
import { CheckoutTable } from "./checkout.schema";

export const TrainingTableRelations = relations(
	TrainingTable,
	({ many, one }) => ({
		thematic: one(ThematicTable, {
			fields: [TrainingTable.thematicId],
			references: [ThematicTable.id],
		}),
		sessions: many(TrainingSessionTable),
		competences: many(KeyCompetencyTable),
		modules: many(ModuleTable),
	}),
);

export const ModuleTableRelations = relations(ModuleTable, ({ one }) => ({
	training: one(TrainingTable, {
		fields: [ModuleTable.courseId],
		references: [TrainingTable.id],
	}),
}));

export const RollingTableRelations = relations(RollingTable, ({ one }) => ({
	session: one(TrainingSessionTable, {
		fields: [RollingTable.sessionId],
		references: [TrainingSessionTable.id],
	}),
	checkout: one(CheckoutTable),
}));

export const CheckoutTableRelations = relations(CheckoutTable, ({ one }) => ({
	rolling: one(RollingTable, {
		fields: [CheckoutTable.rollingId],
		references: [RollingTable.id],
	}),
}));

export const ThematicTableRelations = relations(ThematicTable, ({ many }) => ({
	modules: many(TrainingTable),
}));

export const TrainingSessionTableRelations = relations(
	TrainingSessionTable,
	({ one, many }) => ({
		module: one(TrainingTable, {
			fields: [TrainingSessionTable.moduleId],
			references: [TrainingTable.id],
		}),
		rollings: many(RollingTable),
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
