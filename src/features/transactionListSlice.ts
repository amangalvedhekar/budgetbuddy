import {createSlice} from "@reduxjs/toolkit";

export type TransactionList = {
  addedBy: string;
  amount: number;
  categoryType: string;
  createdDate: string;
  modifiedDate: string;
  transactionTypeName: string;
  description: string;
  transactionType: string;
};
export type TransactionListKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
export type TransactionListSliceProps = Record<TransactionListKey, Array<TransactionList>>

const transactionListSlice = createSlice({
  name: 'transactionList',
  initialState: {} as TransactionListSliceProps,
  reducers: {
    setTransactionList:(state, action) => {
      return (
        {
          ...state,
          ...action.payload
        }
      );
    }
  },
});

export const {setTransactionList} = transactionListSlice.actions
export default transactionListSlice.reducer;
