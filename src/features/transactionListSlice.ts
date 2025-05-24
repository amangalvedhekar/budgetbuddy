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
    setTransactionList: (state, action) => {
      return (
        {
          ...state,
          ...action.payload
        }
      );
    },
    updateTransactionData: (state, action) => {
      const transactionDateSplit = action.payload.createdDate.split('-');
      const transactionYear = transactionDateSplit[0];
      const transactionMonth = Number(transactionDateSplit[1]) - 1;
      const flattenedList = state[transactionYear][transactionMonth] ?? [];
      const updatedData = flattenedList.map(list => {
        if(list.id == action.payload.id) {

          return ({
            ...action.payload,
            transactionTypeName: list.transactionTypeName
          })
        }
        return  list;
      });
      return (
        {
          ...state,
          [transactionYear]: {
            ...state[transactionYear],
          [transactionMonth]: updatedData
      }
        }
      );
    }
  },
});

export const {setTransactionList, updateTransactionData} = transactionListSlice.actions
export default transactionListSlice.reducer;
