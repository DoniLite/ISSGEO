import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";

export const TestimonialsTable = pgTable("Testimonials", {
	...BaseRow,
	name: T.text("name").notNull(),
	starNumber: T.integer("star_number").$default(() => 3),
	message: T.text("message"),
});
