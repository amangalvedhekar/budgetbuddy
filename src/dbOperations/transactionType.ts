import {AppDispatch} from "../store";
import {TransactionTypes} from '../../schema';
import {db} from "../hooks";
import {setTransactions} from "../features/transactionTypeSlice";
export const fetchTransactionType = async (dispatch: AppDispatch) => {
  try {
    const transactionTypes = await db.select().from(TransactionTypes);
    dispatch(setTransactions(transactionTypes))
  } catch (e) {

  }
};
