import * as T from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { BaseRow } from "./shared.schema";
import { RollingTable } from "./rolling.schema";

export const CheckoutTable = pgTable('Checkout', {
  ...BaseRow,
  code: T.text('code')
    .unique()
    .$default(() => crypto.randomUUID()),
  isValidated: T.boolean('is_validated')
    .notNull()
    .$default(() => false),
  rollingId: T.text('rolling_id').references(() => RollingTable.id),
  amount: T.integer('amount').notNull(),
  metaData: T.json('meta_data'),
});
