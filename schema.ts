import { sql, } from "drizzle-orm";
import {sqliteTable, text, integer,} from "drizzle-orm/sqlite-core";

export const TransactionTypes = sqliteTable('TransactionType',{
  transactionName: text('transactionName').notNull().unique(),
  id: text('id').notNull().primaryKey(),
});

export const Categories = sqliteTable('Categories',{
  categoryName: text('categoryName').notNull().unique(),
  id: text('id').notNull().primaryKey(),
  transactionType: text('transactionType').references(() => TransactionTypes.id),
});

export const TransactionLists = sqliteTable('TransactionLists',{
  description: text('description'),
  amount: integer('amount').notNull(),
  createdDate: text('createdDate').default(sql`(CURRENT_TIMESTAMP)`),
  modifiedDate: text('modifiedDate').default(sql`(CURRENT_TIMESTAMP)`),
  id: text('id').notNull().primaryKey(),
  categoryType: text('categoryType').references(() => Categories.id),
  transactionType: text('transactionType').references(() => TransactionTypes.id),
});