import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ExpectedIncome = {
  categoryId: string;
  userId: string;
  value: number;
};

export type ExpectedIncomeKey = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export type ExpectedIncomeSliceProps = Record<ExpectedIncomeKey, Array<ExpectedIncome>>

const expectedIncomeSlice = createSlice({
  name: 'expectedIncome',
  initialState: {} as ExpectedIncomeSliceProps,
  reducers: {
    setExpectedIncome: (state, action) => {
      return (
        {
          ...state,
          ...action.payload
        }
      )
    },

  },
});

export const {setExpectedIncome} = expectedIncomeSlice.actions;
export default expectedIncomeSlice.reducer;
