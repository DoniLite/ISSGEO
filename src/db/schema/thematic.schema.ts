import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";

export const ThematicTable = pgTable("Thematic", {
	...BaseRow,
	name: T.text("name").notNull(),
	icon: T.text("icon").notNull(),
});
