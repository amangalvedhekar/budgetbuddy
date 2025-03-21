import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersSlice';
import categoriesReducer from '../features/categoriesSlice';
import transactionTypeReducer from '../features/transactionTypeSlice';
import budgetedExpenseReducer from '../features/budgetedExpenseSlice';
import expectedIncomeReducer from '../features/expectedIncomeSlice';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

export const store = configureStore({
  reducer: {
    user: usersReducer,
    categories:categoriesReducer,
    transactionType: transactionTypeReducer,
    budgetedExpense: budgetedExpenseReducer,
    expectedIncome: expectedIncomeReducer,
  },
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/*
 const store = {
 users: [],
 categories: [],
 transactionType: [],
 transactionList: [],
 budgetedExpense: [],
 expectedIncome: [],

 const budgetedExpense = [
 {month: 'January', year: '2025' categories: [{categoryType: '', amount: 0}]}
 ];
 const budgetedIncome = [
 {month: 'January', year: '2025', categories: [{categoryType: '', amount:0}],}
 ];
* */