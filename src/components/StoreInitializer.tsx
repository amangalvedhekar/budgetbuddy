import {useDispatch} from "react-redux";
import {ReactNode, useEffect} from "react";
import {fetchTransactionType} from "../dbOperations/transactionType";
import {fetchCategories} from "../dbOperations/categories";
import {addUser} from "../dbOperations/user";
import {useAuth} from "../hooks";
import {getBudgetedExpenseForMonth} from "../dbOperations/budgetedExpense";
import {BudgetedData} from "../../schema";
import {getExpectedIncomeForMonth} from "../dbOperations/expectedIncome";
import {getTransactionMonthIndexed} from "../dbOperations/transactionList";

export const StoreInitializer = ({children}:{children: ReactNode}) => {
  const dispatch = useDispatch();
  const {ab} = useAuth();
  useEffect(() => {
    (async () => {
      if (ab != null) {
        try {
          await fetchTransactionType(dispatch);
          await fetchCategories(dispatch);
          await addUser({dispatch, userId: ab?.userId ?? '', email: ab?.signInDetails?.loginId});
          await getTransactionMonthIndexed({userId: ab?.userId, dispatch})
          const monthList = Array
            .from({ length: 12 }, (v, i) => i);
          for(const month of monthList) {
            await getBudgetedExpenseForMonth({
              userId: (ab?.userId as unknown as typeof BudgetedData.userId),
              month: (month as unknown as typeof BudgetedData.month),
              dispatch
            });
            await getExpectedIncomeForMonth({
              userId: (ab?.userId as unknown as typeof BudgetedData.userId),
              month: (month as unknown as typeof BudgetedData.month),
              dispatch
            });
          }

        }catch (e) {
          console.log(JSON.stringify(e),'error is')
        }
      }

    })();
  }, [dispatch, ab]);
  return children;
}
