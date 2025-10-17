import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { JobContractEnum } from "./enums";

export const JobOfferTable = pgTable("Job_offer", {
	...BaseRow,
	title: T.text("title").notNull(),
	location: T.text("location").notNull(),
	contract: JobContractEnum("contract").$default(() => "CDD"),
});
