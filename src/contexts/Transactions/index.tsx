import {createContext, useCallback, useReducer} from "react";
import {Transaction, TransactionContextProvider, TransactionList, TransactionProviderProps} from "./types";
const initialState: TransactionList = [];
function reducer(state: TransactionList, action: any) {
switch (action.type) {
  case 'ADD_TRANSACTION':
    return [...state,action.payload];
  default:
    return state;
}
}
const TransactionContext = createContext<TransactionContextProvider | null>(null);

const TransactionProvider =({children}:TransactionProviderProps) => {
  const [transactions, dispatch] = useReducer(reducer,initialState);

  const addTransaction = useCallback((transactionToAdd: Transaction) => {
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: transactionToAdd
    });
  }, []);

  console.log(transactions,'updated')
  return (
    <TransactionContext.Provider
      value={{
        add:addTransaction,
        delete: () => {},
        edit: () => {},
        retrieve: () => {},
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export {
  TransactionProvider,
  TransactionContext,
};
