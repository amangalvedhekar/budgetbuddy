import {AppDispatch} from "../store";
import {BudgetedData, Categories} from "../../schema";
import {getBudgetedDataForUser} from "./budgetedData";
import {getCategoriesForTransactionType} from "./categories";
import {setExpectedIncome} from "../features/expectedIncomeSlice";
import {db} from "../hooks";
import {and, eq} from "drizzle-orm";
import {setBudgetedExpense} from "../features/budgetedExpenseSlice";
import {SetBudgetedExpenseForMonthProps} from "./budgetedExpense";

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
              label: elm.name,
              value: 0
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

export const setExpectedIncomeForMonth = async ({userId, month, dispatch, dataToSet}: SetBudgetedExpenseForMonthProps) => {
  try {
    if(Array.isArray(dataToSet)) {
      const dispatchData =[];
      for(const item of dataToSet) {
        const isPresent = await db.query.BudgetedData.findFirst({
          where: and(
            eq(
              BudgetedData.userId,
              userId
            ),
            eq(
              BudgetedData.month,
              month,
            ),
            eq(
              BudgetedData.categoryType,
              item.categoryId,
            )
          )
        })
        if (isPresent) {
          await db
            .update(BudgetedData)
            .set({
              value: Number(item.value) ?? 0,
            })
            .where(
              and(
                eq(
                  BudgetedData.userId,
                  userId
                ),
                eq(
                  BudgetedData.month,
                  month,
                ),
                eq(
                  BudgetedData.categoryType,
                  item.categoryId,
                )
              )
            )
        } else {
          await db.insert(BudgetedData).values({
            categoryType: item.categoryId,
            userId,
            value: Number(item.value) ?? 0,
            month,
          })
        }
        dispatchData.push({
          ...item,
          value: Number(item.value),
          label: item.name,
        })
      }
      const dataToDispatch = {
        [(month as unknown as number)]: dispatchData,
      }
      dispatch(setExpectedIncome(dataToDispatch));
    }
  } catch (e) {
    console.error(e, 'error while saving expected income')
  }
}