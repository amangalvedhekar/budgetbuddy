import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type User = {
  userId: string;
  email: string;
  isUserOnboarded: boolean | null;
  appearance: 'dark' | 'light';
  appearanceSettings: 'dark' | 'light' | 'deviceSettings';
};
const defaultState = {
  userId: '',
  email: '',
  isUserOnboarded: null,
  appearance: 'light',
  appearanceSettings: 'deviceSettings',
};
const usersSlice = createSlice({
  name: 'user',
  initialState: {} as User,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {


      return ({
        ...state,
        ...action.payload,
        // appearance,
        // appearanceSettings,
      });
    },
    removeUser: () => {
      return defaultState
    }
  },
});

export const {setUser, removeUser} = usersSlice.actions;
export default usersSlice.reducer;
