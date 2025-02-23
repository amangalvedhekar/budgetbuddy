import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  userId: string;
  isUserOnboarded: boolean | null;
};

const usersSlice = createSlice({
  name: 'user',
  initialState: {} as User,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
  },
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;
