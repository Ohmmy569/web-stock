import {
  pgTable,
  pgEnum,
  text,
  varchar,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';

export const enumRoles = pgEnum('enumRoles', ['user', 'admin']);

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text().notNull(),
  role: enumRoles('role').notNull().default('user'),
  createOn: timestamp('createOn').defaultNow(),
  updateOn: timestamp('updateOn').$onUpdate(() => new Date()),
});
