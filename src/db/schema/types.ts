import type { ContactTable } from './contact.schema';
import type { JobOfferTable } from './job.schema';
import type { TrainingSessionTable } from './session.schema';
import type { TestimonialsTable } from './testimonials.schema';
import type { ThematicTable } from './thematic.schema';
import type { KeyCompetencyTable, TrainingTable } from './training.schema';
import type { UserTable } from './user.schema';

export type TrainingTableType = typeof TrainingTable.$inferInsert;
export type TrainingSessionTableType = typeof TrainingSessionTable.$inferInsert;
export type KeyCompetencyTableType = typeof KeyCompetencyTable.$inferInsert;
export type JobOfferTableType = typeof JobOfferTable.$inferInsert;
export type ThematicTableType = typeof ThematicTable.$inferInsert;
export type TestimonialsTableType = typeof TestimonialsTable.$inferInsert;
export type ContactTableType = typeof ContactTable.$inferInsert;
export type UserTableType = typeof UserTable.$inferInsert;
