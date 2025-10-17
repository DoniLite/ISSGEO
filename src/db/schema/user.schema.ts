import * as T from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { BaseRow } from './shared.schema';
import { UserRoles } from './enums';

export const UserTable = pgTable('User', {
  ...BaseRow,
  email: T.text('email').notNull().unique(),
  password: T.text('password').notNull(),
  name: T.text('name'),
  image: T.text('image'),
  role: UserRoles('role').$default(() => 'user')
});
