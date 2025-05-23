import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersSlice';
import categoriesReducer from '../features/categoriesSlice';
import transactionTypeReducer from '../features/transactionTypeSlice';
import budgetedExpenseReducer from '../features/budgetedExpenseSlice';
import expectedIncomeReducer from '../features/expectedIncomeSlice';
import transactionListReducer from '../features/transactionListSlice';
import transactionFilterReducer from '../features/transactionFilterSlice';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

export const store = configureStore({
  reducer: {
    user: usersReducer,
    categories:categoriesReducer,
    transactionType: transactionTypeReducer,
    budgetedExpense: budgetedExpenseReducer,
    expectedIncome: expectedIncomeReducer,
    transactionList: transactionListReducer,
    transactionFilter: transactionFilterReducer,
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
 transactionFilter: {
  category: [],
  month: [],
  transactionType: ''
 },

 const budgetedExpense = [
 {month: 'January', year: '2025' categories: [{categoryType: '', amount: 0}]}
 ];
 const budgetedIncome = [
 {month: 'January', year: '2025', categories: [{categoryType: '', amount:0}],}
 ];
* */