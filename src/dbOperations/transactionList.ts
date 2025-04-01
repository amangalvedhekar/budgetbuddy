import {db} from "../hooks";
import {TransactionLists, TransactionTypes} from '../../schema'
import {and, desc, eq} from "drizzle-orm";

export interface InsertTransactionProps {
  transactionType: typeof TransactionLists.transactionType;
  amount: typeof TransactionLists.amount;
  createdDate: typeof TransactionLists.createdDate;
  categoryType: typeof TransactionLists.categoryType;
  description: typeof TransactionLists.description;
  addedBy: typeof TransactionLists.addedBy;
  id: typeof TransactionLists.id;
}

export const getTransactionForUser = async ({userId}: { userId: string }) => {
  try {
    const transactionList = await db
      .select({
        id: TransactionLists.id,
        addedBy: TransactionLists.addedBy,
        amount: TransactionLists.amount,
        categoryType: TransactionLists.categoryType,
        createdDate: TransactionLists.createdDate,
        modifiedDate: TransactionLists.modifiedDate,
        transactionTypeName: TransactionTypes.transactionName,
        description: TransactionLists.description,
        transactionType: TransactionLists.transactionType,
      })
      .from(TransactionLists)
      .where(
        and(
          eq(TransactionLists.addedBy, userId),
          eq(TransactionLists.isDeleted, false),
        ))
      .leftJoin(
        TransactionTypes,
        eq(TransactionLists.transactionType, TransactionTypes.id)
      )
      .orderBy(desc(
        TransactionLists.createdDate,
      ));
    return transactionList;
  } catch (e) {
    console.log(e, 'hmm')
  }
};

export const insertTransactionForUser = async (
  {transactionType, categoryType, createdDate, amount, addedBy, description}: InsertTransactionProps) => {
  try {
    const id = (Math.floor(Math.random() * 9999).toString() as unknown as typeof TransactionLists.id);
    const dataToInsert: InsertTransactionProps = {
      id,
      transactionType,
      amount,
      createdDate,
      categoryType,
      description,
      addedBy,
    };
    await db.insert(TransactionLists).values(dataToInsert)
  } catch (e) {
    console.log(JSON.stringify(e), 'error while inserting record')
  }
}
