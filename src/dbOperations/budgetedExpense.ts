import {db} from '../hooks';
import {setBudgetedExpense} from "../features/budgetedExpenseSlice";
import {BudgetedData, Categories} from "../../schema";
import {and, eq} from "drizzle-orm";

export const getBudgetedExpenseForMonth = async ({userId, month, dispatch}) => {
  try {
    const budgetedDataForUser = await db
      .select({
        categoryId: BudgetedData.categoryType,
        value: BudgetedData.value
      })
      .from(BudgetedData)
      .where(and(
        eq(
          userId,
          BudgetedData.userId,
        ),
        eq(
          month,
          BudgetedData.month
        )
      ));

    const categoriesForExpense = await db
      .select({
        categoryId: Categories.id,
        name: Categories.categoryName
      })
      .from(Categories)
      .where(
        eq(
          '1',
          Categories.transactionType
        ));

    const budgetedExpenseForMonth = categoriesForExpense
      .reduce((acc, elm) => {
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
      [month]: budgetedExpenseForMonth,
    };
    dispatch(setBudgetedExpense(dataToDispatch));
  } catch (e) {
    console.error(JSON.stringify(e), 'error')
  }
};
