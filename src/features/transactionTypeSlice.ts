import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type Transaction = {
  transactionName: string;
  id: string;
};


const transactionTypeSlice = createSlice({
  name: 'transactions',
  initialState: [] as Transaction[],
  reducers: {
    setTransactions: (state, action) => {
      return action.payload;
    }
  },
  });

export const {setTransactions} = transactionTypeSlice.actions;
export default transactionTypeSlice.reducer;
