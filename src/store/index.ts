import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../features/usersSlice';
import categoriesReducer from '../features/categoriesSlice';
import transactionTypeReducer from '../features/transactionTypeSlice';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    categories:categoriesReducer,
    transactionType: transactionTypeReducer,
  },
  enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/*
* const store = {
* users: [],
* categories: [],
* transactionType: [],
* transactionList: [],
* budgetedData: [],
*
* const budgetedData = {
* userId: []
* };
* };
* */