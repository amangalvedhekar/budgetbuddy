import {db} from "../hooks";
import {TransactionLists, TransactionTypes} from '../../schema'
import {and, desc, eq} from "drizzle-orm";

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
