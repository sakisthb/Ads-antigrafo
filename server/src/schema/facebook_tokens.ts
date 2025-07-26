import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const facebookTokens = pgTable('facebook_tokens', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 64 }).notNull(),
  access_token: varchar('access_token', { length: 512 }).notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}); 