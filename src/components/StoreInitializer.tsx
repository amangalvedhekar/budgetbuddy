import {useDispatch} from "react-redux";
import {ReactNode, useEffect} from "react";
import {fetchTransactionType} from "../dbOperations/transactionType";
import {fetchCategories} from "../dbOperations/categories";
import {addUser} from "../dbOperations/user";
import {useAuth} from "../hooks";
import {getBudgetedExpenseForMonth} from "../dbOperations/budgetedExpense";

export const StoreInitializer = ({children}:{children: ReactNode}) => {
  const dispatch = useDispatch();
  const {ab} = useAuth();
  useEffect(() => {
    (async () => {
      await fetchTransactionType(dispatch);
      await fetchCategories(dispatch);
      await addUser({dispatch, userId: ab?.userId ?? ''});
      const monthList = Array
        .from({ length: 12 }, (v, i) => i);
      for(const month of monthList) {
        await getBudgetedExpenseForMonth({
          userId: ab?.userId,
          month,
          dispatch
        });
      }

    })();
  }, [dispatch]);
  return children;
}
