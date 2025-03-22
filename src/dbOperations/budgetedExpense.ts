import {setBudgetedExpense} from "../features/budgetedExpenseSlice";
import {BudgetedData, Categories} from "../../schema";

import {getBudgetedDataForUser} from "./budgetedData";
import {getCategoriesForTransactionType} from "./categories";
import {AppDispatch} from "../store";
import {db} from "../hooks";
import {and, eq} from "drizzle-orm";

export type BudgetedExpenseForMonthProps = {
  userId: typeof BudgetedData.userId;
  month: typeof BudgetedData.month;
  dispatch: AppDispatch;
};
export type SetBudgetedExpenseForMonthProps = {
  dataToSet: Array<unknown>;
} & BudgetedExpenseForMonthProps;

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
              text: elm.name,
              value: foundElm.value,
            };
            return [...acc, updatedData]
          } else {
            const data = {
              ...elm,
              text: elm.name,
              value: 0
            };
            return [...acc, data];
          }
        }, []);

    const dataToDispatch = {
      [(month as unknown as number)]: budgetedExpenseForMonth,
    };
    dispatch(setBudgetedExpense(dataToDispatch));
  } catch (e) {
    console.error(JSON.stringify(e), 'error happening here');
  }
};

export const setBudgetedExpenseForMonth = async ({userId, month, dispatch, dataToSet}: SetBudgetedExpenseForMonthProps) => {
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
          text: item.name,
        })
      }
      const dataToDispatch = {
        [(month as unknown as number)]: dispatchData,
      }
      dispatch(setBudgetedExpense(dataToDispatch));
    }
  } catch (e) {
console.error(e, 'error while saving')
  }
}
