import {useDispatch} from "react-redux";
import {ReactNode, useEffect} from "react";
import {fetchTransactionType} from "../dbOperations/transactionType";
import {fetchCategories} from "../dbOperations/categories";
import {addUser, getUser} from "../dbOperations/user";
import {useAuth} from "../hooks";
import {getBudgetedExpenseForMonth} from "../dbOperations/budgetedExpense";
import {BudgetedData} from "../../schema";
import {getExpectedIncomeForMonth} from "../dbOperations/expectedIncome";
import {getTransactionMonthIndexed} from "../dbOperations/transactionList";
import {useColorScheme} from "react-native";

export const StoreInitializer = ({children}:{children: ReactNode}) => {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const {ab} = useAuth();
  useEffect(() => {
    (async () => {
      console.log(scheme, 'scheme inside use effect of store initializer')
      if (ab != null && ab?.userId != '') {
        try {
          await fetchTransactionType(dispatch);
          await fetchCategories(dispatch);
          const data = await getUser({dispatch, userId: ab?.userId});
          const appearanceSettings = data[0]?.appearanceSettings ?? 'deviceSettings';
          const appearance = appearanceSettings == 'deviceSettings' ? scheme : (data[0]?.appearance ?? scheme);
          await addUser(
            {
              dispatch,
              userId: ab?.userId ?? '',
              email: ab?.signInDetails?.loginId ?? '',
              appearance,
              appearanceSettings,
            }
          );
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
  }, [dispatch, ab, scheme]);
  return children;
}
