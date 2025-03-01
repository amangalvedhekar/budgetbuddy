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

const transactionListSlice = createSlice({
  name: 'transactionList',
  initialState: [] as TransactionList[],
  reducers: {
    setTransactionList:(state, action) => {
      return action.payload;
    }
  },
});

export const {setTransactionList} = transactionListSlice.actions
export default transactionListSlice.reducer;
