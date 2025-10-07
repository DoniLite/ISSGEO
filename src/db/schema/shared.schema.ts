import * as T from 'drizzle-orm/pg-core';

export const Timestamp = {
  createdAt: T.timestamp('created_at').defaultNow(),
  updatedAt: T.timestamp('updated_at').$onUpdate(() => new Date()),
  deletedAt: T.timestamp('deleted_at'),
};
