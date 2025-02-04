import {AppDispatch} from "../store";
import {db} from "../hooks";
import {UserLists} from "../../schema";
import {setUsers} from "../features/usersSlice";

export const fetchUsers = async (dispatch: AppDispatch) => {
  const data = await db
    .select()
    .from(UserLists);
  dispatch(setUsers(data));
}