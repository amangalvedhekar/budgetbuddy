import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  userId: string;
  isUserOnboarded: boolean | null;
};

const usersSlice = createSlice({
  name: 'users',
  initialState: [] as User[],
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      return action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.push(action.payload);
    },
  },
});

export const { setUsers, addUser } = usersSlice.actions;
export default usersSlice.reducer;
