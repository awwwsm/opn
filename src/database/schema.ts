import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const profilesTable = pgTable('profiles_table', {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  id: serial('id').primaryKey(),
  isActive: boolean('is_active').notNull().default(true),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
  username: text('username').notNull().unique(),
  visits: integer('visits').notNull().default(0),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
