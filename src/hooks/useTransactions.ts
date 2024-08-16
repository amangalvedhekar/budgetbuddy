import {useContext} from "react";
import {TransactionContext} from "../contexts";

export const useTransactions = () => {
  const transactionContext = useContext(TransactionContext);
  if (transactionContext == undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return transactionContext;
}