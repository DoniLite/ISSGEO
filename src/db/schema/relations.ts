import { relations } from "drizzle-orm";
import {
	KeyCompetencyTable,
	MasterTable,
	ModuleTable,
	TrainingTable,
} from "./training.schema";
import { ThematicTable } from "./thematic.schema";
import { TrainingSessionTable } from "./session.schema";
import { RollingTable, RollingToModuleTable } from "./rolling.schema";
import { CheckoutTable } from "./checkout.schema";

export const TrainingTableRelations = relations(
	TrainingTable,
	({ many, one }) => ({
		thematic: one(ThematicTable, {
			fields: [TrainingTable.thematicId],
			references: [ThematicTable.id],
		}),
		master: one(MasterTable, {
			fields: [TrainingTable.masterId],
			references: [MasterTable.id],
		}),
		sessions: many(TrainingSessionTable),
		competences: many(KeyCompetencyTable),
		modules: many(ModuleTable),
		rollings: many(RollingTable),
	}),
);

export const MasterTableRelations = relations(MasterTable, ({ many }) => ({
	courses: many(TrainingTable),
}));

export const ModuleTableRelations = relations(ModuleTable, ({ one, many }) => ({
	training: one(TrainingTable, {
		fields: [ModuleTable.courseId],
		references: [TrainingTable.id],
	}),
	rollingToModules: many(RollingToModuleTable),
}));

export const RollingTableRelations = relations(
	RollingTable,
	({ one, many }) => ({
		course: one(TrainingTable, {
			fields: [RollingTable.courseId],
			references: [TrainingTable.id],
		}),
		checkout: one(CheckoutTable),
		rollingToModules: many(RollingToModuleTable),
	}),
);

export const RollingToModuleRelations = relations(
	RollingToModuleTable,
	({ one }) => ({
		module: one(ModuleTable, {
			fields: [RollingToModuleTable.moduleId],
			references: [ModuleTable.id],
		}),
		rolling: one(RollingTable, {
			fields: [RollingToModuleTable.rollingId],
			references: [RollingTable.id],
		}),
	}),
);

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
