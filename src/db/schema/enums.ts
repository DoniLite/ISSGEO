import { pgEnum } from 'drizzle-orm/pg-core';

export const JobContractEnum = pgEnum('Job_contract', [
  'CDI',
  'CDD',
  'Freelance',
  'Stage',
]);

export const UserRoles = pgEnum('user_role', ['admin', 'user', 'maintainer']);
