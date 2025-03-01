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
export const addUser = async({dispatch, userId}: { dispatch: AppDispatch, userId: string }) => {
  const isUserAdded = checkIfUserExists(userId);
  const dataToAdd = {
    userId,
    isUserOnboarded: false,
  };
  if(!isUserAdded) {
    await db.insert(UserLists).values(dataToAdd);
  }
  dispatch(setUser(dataToAdd));
};
