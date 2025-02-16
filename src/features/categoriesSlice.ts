import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CategoriesWithTransaction = {
  categoryName: string;
  id: string;
  transactionType: string | null;
  transactionName: string | null;
};
export type Category = {
  categoryName: string;
  id: string;
  transactionType: string;
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: [] as CategoriesWithTransaction[],
  reducers: {
    setCategories: (state, action: PayloadAction<CategoriesWithTransaction[]>) => {
      return action.payload;
    },
    addCategories: (state, action: PayloadAction<CategoriesWithTransaction>) => {
      state.push(action.payload);
    },
  }
});

export const {setCategories, addCategories} = categoriesSlice.actions;
export default categoriesSlice.reducer;
