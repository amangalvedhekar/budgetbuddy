import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type BudgetedExpense = {
  categoryId: string;
  userId: string;
  value: number;
};

export type BudgetExpenseKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type BudgetedExpenseSliceProps = Record<BudgetExpenseKey, Array<BudgetedExpense>>

const budgetedExpensesSlice = createSlice({
  name: 'budgetedExpense',
  initialState: {} as BudgetedExpenseSliceProps,
  reducers: {
    setBudgetedExpense: (state, action) => {
      return (
        {
          ...state,
          ...action.payload
        }
      )
    },

  },
});

export const {setBudgetedExpense} = budgetedExpensesSlice.actions;
export default budgetedExpensesSlice.reducer;
