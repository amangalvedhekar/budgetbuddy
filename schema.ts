import { sql, } from "drizzle-orm";
import {sqliteTable, text, integer, real, primaryKey} from "drizzle-orm/sqlite-core";

export const TransactionTypes = sqliteTable('TransactionType',{
  transactionName: text('transactionName').notNull().unique(),
  id: text('id').notNull().primaryKey(),
});

export const Categories = sqliteTable('Categories',{
  categoryName: text('categoryName').notNull().unique(),
  id: text('id').notNull().primaryKey(),
  transactionType: text('transactionType').references(() => TransactionTypes.id),
});


export const UserLists = sqliteTable('UserLists',{
  userId: text('userId').notNull().primaryKey(),
  isUserOnboarded: integer('isUserOnboarded', {mode: "boolean"}).default(false),
});

export const TransactionLists = sqliteTable('TransactionLists',{
  description: text('description'),
  amount: integer('amount').notNull(),
  createdDate: text('createdDate').default(sql`(CURRENT_DATE)`),
  modifiedDate: text('modifiedDate'),
  id: text('id').notNull().primaryKey(),
  addedBy: text('addedBy').references(() => UserLists.userId),
  categoryType: text('categoryType').references(() => Categories.id),
  transactionType: text('transactionType').references(() => TransactionTypes.id),
  isDeleted: integer('isDeleted',{mode: 'boolean'}).default(false),
  deletedDate: text('deletedDate'),
});

export const BudgetedData = sqliteTable('BudgetedData', {
  categoryType: text('categoryType').references(() => Categories.id),
  userId: text('userId').references(() => UserLists.userId),
  value: real('value').default(0),
  month: integer('month').default(0),
}, (table) => {
  return ({
    pk: primaryKey({
      columns: [table.userId, table.categoryType, table.month]
    })
  });
});
