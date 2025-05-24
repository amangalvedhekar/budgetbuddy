import {AppDispatch} from "../store";
import {db} from "../hooks";
import {UserLists} from "../../schema";
import {setUser} from "../features/usersSlice";
import {eq} from "drizzle-orm";

export const checkIfUserExists = async (userId: string) => {
  const isUserAdded = await db
    .select()
    .from(UserLists)
    .where(eq(UserLists.userId, userId));
  return Array.isArray(isUserAdded) && isUserAdded.length > 0;
}

export const addUser = async ({dispatch, userId, email,appearance,appearanceSettings}: { dispatch: AppDispatch, userId: string, email: string }) => {
  const isUserAdded = checkIfUserExists(userId);
  const dataToAdd = {
    userId,
    isUserOnboarded: false,
  };
  if (!isUserAdded) {
    await db.insert(UserLists).values(dataToAdd);
  }
  dispatch(setUser({...dataToAdd, email, appearance, appearanceSettings}));
};

export const updateUser = async ({userId, data, dispatch}) => {
  try {
    await db
      .update(UserLists)
      .set(data)
      .where(eq(UserLists.userId, userId));
    dispatch(setUser({...data}));
  } catch (e) {
    console.log(JSON.stringify(e), 'error')
  }
}

export const getUser = async ({userId, dispatch}) => {
  try {
    const data = await db
      .select({
        appearance: UserLists.appearance,
        appearanceSettings: UserLists.appearanceSettings,
      })
      .from(UserLists)
      .where(eq(UserLists.userId, userId));

    return data;
    // dispatch();

  } catch (e) {
    console.log(JSON.stringify(e), 'error')
  }
}
