import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  userId: string;
  email: string;
  isUserOnboarded: boolean | null;
};
const defaultState = {
  userId: '',
  email: '',
  isUserOnboarded: null,
};
const usersSlice = createSlice({
  name: 'user',
  initialState: {} as User,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    removeUser: () => {
      return defaultState
    }
  },
});

export const { setUser, removeUser } = usersSlice.actions;
export default usersSlice.reducer;
