import {db} from "../hooks";
import {TransactionLists, TransactionTypes} from '../../schema'
import {and, desc, eq} from "drizzle-orm";
import {setTransactionList, updateTransactionData} from "../features/transactionListSlice";

export interface InsertTransactionProps {
  transactionType: typeof TransactionLists.transactionType;
  amount: typeof TransactionLists.amount;
  createdDate: typeof TransactionLists.createdDate;
  categoryType: typeof TransactionLists.categoryType;
  description: typeof TransactionLists.description;
  addedBy: typeof TransactionLists.addedBy;
  id: typeof TransactionLists.id;
  isRecurringTransaction: typeof TransactionLists.isRecurringTransaction;
}

export interface UpdateTransactionProps {
  dataToSave: InsertTransactionProps;

}
/*
const transactionList = {
2025: {
0: [],
1: []
}
};
* */
export const getTransactionMonthIndexed = async ({userId, dispatch}) => {
  const transactionList = await getTransactionForUser({userId});
  const transactionMonthBasis = transactionList.reduce((acc, elm) => {
    const createdDate = new Date(elm.createdDate);
    createdDate.setTime(createdDate.getTime() + 955 * 60 *1000)
    const month = createdDate.getMonth();
    const year = createdDate.getFullYear();
    if (year in acc) {
      if(month in acc[year]) {
        acc[year][month] = [...acc[year][month], elm];
      }else {
        acc[year][month] = [elm]
      }
    } else {
      acc[year] = {[month]: [elm]};
    }
    return acc;
  }, {});
  dispatch(setTransactionList(transactionMonthBasis));
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
        isRecurringTransaction: TransactionLists.isRecurringTransaction,
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

export const updateTransaction = async ({dataToSave, dispatch}: UpdateTransactionProps) => {
  try {
    await db.update(TransactionLists).set(dataToSave).where(eq(
      TransactionLists.id, dataToSave?.id
    ));
    dispatch(updateTransactionData(dataToSave));
  } catch (e) {
    throw e;
  }
}

export const insertTransactionForUser = async (
  {transactionType, categoryType, createdDate, amount, addedBy, description,isRecurringTransaction, dispatch}: InsertTransactionProps) => {
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
      isRecurringTransaction,
    };
    await db.insert(TransactionLists).values(dataToInsert);
    await getTransactionMonthIndexed({userId: addedBy, dispatch});
  } catch (e) {
    console.log(JSON.stringify(e), 'error while inserting record');
    throw e;
  }
}
