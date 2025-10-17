import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";

export const ContactTable = pgTable("Contact", {
	...BaseRow,
	name: T.text("name").notNull(),
	email: T.text("email").notNull(),
	message: T.text("message").notNull(),
});
