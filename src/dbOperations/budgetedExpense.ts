import {setBudgetedExpense} from "../features/budgetedExpenseSlice";
import {BudgetedData, Categories} from "../../schema";

import {getBudgetedDataForUser} from "./budgetedData";
import {getCategoriesForTransactionType} from "./categories";
import {AppDispatch} from "../store";
export type BudgetedExpenseForMonthProps = {
  userId: typeof BudgetedData.userId;
  month: typeof BudgetedData.month;
  dispatch: AppDispatch;
};

export const getBudgetedExpenseForMonth = async ({userId, month, dispatch}: BudgetedExpenseForMonthProps) => {
  try {
    const budgetedDataForUser = await getBudgetedDataForUser({userId, month});
    const categoriesForExpense = await getCategoriesForTransactionType({transactionType: ('1' as unknown as typeof Categories.transactionType)})
    const budgetedExpenseForMonth = categoriesForExpense
      .reduce(
        //@ts-ignore
        (acc, elm) => {
        const foundElm = budgetedDataForUser.find(budgetElm => budgetElm.categoryId == elm.categoryId);

        if (foundElm) {
          const updatedData = {
            ...elm,
            value: foundElm.value,
          };
          return [...acc, updatedData]
        }
        return acc;
      }, []);

    const dataToDispatch = {
      [(month as unknown as number)]: budgetedExpenseForMonth,
    };
    dispatch(setBudgetedExpense(dataToDispatch));
  } catch (e) {
    console.error(JSON.stringify(e), 'error');
  }
};
