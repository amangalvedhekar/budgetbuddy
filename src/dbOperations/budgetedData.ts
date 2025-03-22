import {db} from "../hooks";
import {BudgetedData} from "../../schema";
import {and, eq} from "drizzle-orm";

export type BudgetedDataForUserProps = {
  userId: typeof BudgetedData.userId;
  month: typeof BudgetedData.month;
}

export const getBudgetedDataForUser = async ({userId, month}: BudgetedDataForUserProps) => {
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
    return budgetedDataForUser;
  } catch (e) {
    throw e;
  }
}