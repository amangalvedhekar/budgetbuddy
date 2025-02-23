import {useDispatch} from "react-redux";
import {ReactNode, useEffect} from "react";
import {fetchTransactionType} from "../dbOperations/transactionType";
import {fetchCategories} from "../dbOperations/categories";
import {addUser} from "../dbOperations/user";
import {useAuth} from "../hooks";

export const StoreInitializer = ({children}:{children: ReactNode}) => {
  const dispatch = useDispatch();
  const {ab} = useAuth();
  useEffect(() => {
    (async () => {
      await fetchTransactionType(dispatch);
      await fetchCategories(dispatch);
      await addUser({dispatch, userId: ab?.userId ?? ''});
    })();
  }, [dispatch]);
  return children;
}
