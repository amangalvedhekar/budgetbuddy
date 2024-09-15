// import { sql, } from "drizzle-orm";
import {sqliteTable, text, integer, real,} from "drizzle-orm/sqlite-core";

export const TransactionTypes = sqliteTable('TransactionTypes',{
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
  createdDate: real('createdDate').notNull(),
  modifiedDate: real('modifiedDate').notNull(),
  id: text('id').notNull().primaryKey(),
  categoryType: text('categoryType').references(() => Categories.id),
  transactionType: text('transactionType').references(() => TransactionTypes.id),
});