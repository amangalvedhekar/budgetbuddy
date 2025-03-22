import {AppDispatch} from "../store";
import {BudgetedData, Categories} from "../../schema";
import {getBudgetedDataForUser} from "./budgetedData";
import {getCategoriesForTransactionType} from "./categories";
import {setExpectedIncome} from "../features/expectedIncomeSlice";

export type ExpectedIncomeForMonthProps = {
  userId: typeof BudgetedData.userId;
  month: typeof BudgetedData.month;
  dispatch: AppDispatch;
};



export const getExpectedIncomeForMonth = async ({userId, month, dispatch}:ExpectedIncomeForMonthProps) => {
  try {
    const budgetedDataForUser = await getBudgetedDataForUser({userId, month});
    const categoriesForIncome = await getCategoriesForTransactionType({transactionType: ('0' as unknown as typeof Categories.transactionType)})
    const expectedIncomeForMonth = categoriesForIncome
      .reduce(
        //@ts-ignore
        (acc, elm) => {
          const foundElm = budgetedDataForUser.find(budgetElm => budgetElm.categoryId == elm.categoryId);

          if (foundElm) {
            const updatedData = {
              ...elm,
              label: elm.name,
              value: foundElm.value,
            };
            return [...acc, updatedData]
          } else {
            const data = {
              ...elm,
              value: ''
            };
            return [...acc, data];
          }
        }, []);

    const dataToDispatch = {
      [(month as unknown as number)]: expectedIncomeForMonth,
    };
    dispatch(setExpectedIncome(dataToDispatch));
  }catch (e) {
    console.error(JSON.stringify(e), 'error');
  }
}