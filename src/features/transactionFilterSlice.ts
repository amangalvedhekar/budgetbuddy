import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CategoriesWithTransaction} from "./categoriesSlice";

export type TransactionFilterSlice = {
  selectedCategory: Array<CategoriesWithTransaction>;
  selectedMonth: Array<Record<string, any>>;
}

const transactionFilterSlice = createSlice({
  name: 'transactionFilter',
  initialState: {
    selectedMonth: [],
    selectedCategory: [],
  } as TransactionFilterSlice,
  reducers: {
    setSelectedCategory: (state, action) => {
      const {isSelected, categoryName} = action.payload;
      let newState;
      if (isSelected) {
        newState = [...state.selectedCategory, categoryName];
      } else {
        newState = state.selectedCategory.filter((x) => x != categoryName);
      }
      return(
        {
          ...state,
          selectedCategory: newState,
        }
      );
    },
    setSelectedMonth: (state, action) => {
      const {isSelected, month} = action.payload;
      let newState;
      if (isSelected) {
        newState = [...state.selectedMonth, month];
      } else {
        newState = state.selectedMonth.filter((x) => x.name != month.name);
      }
      return(
        {
          ...state,
          selectedMonth: newState,
        }
      )
    },
    resetFilters: (state) => {
      return (
        {
          ...state,
          selectedMonth: [],
          selectedCategory:[],
        }
      );
    }
  }
});


export const {setSelectedCategory, setSelectedMonth, resetFilters} = transactionFilterSlice.actions;
export default transactionFilterSlice.reducer;
