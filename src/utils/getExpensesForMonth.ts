import {filterDataForDashboard} from "./filterDataForDashboard";

const actualExpenses = {
  // 0 --> January
  0: [{
    id: '1',
    actualSpent: 350,
    categoryName: 'Grocery',
    budgetedAmount: 450,
  }]
};
export type ExpenseAndBudgetedDataForMonthProps = {
  budgetedExpense: Array<unknown>;
  expenseTransactionList: Array<unknown>;
  monthList: Array<unknown>;
};

export const getExpenseAndBudgetedDataForMonth = (
  {
    budgetedExpense,
    expenseTransactionList,
    monthList,
  }: ExpenseAndBudgetedDataForMonthProps,
) => {

};
export const getBudgetedAndActualAmount = (
  {
    budgetedExpense,
    actualTransactions,
  }: unknown
) => {
  const accumulator = {};
  return filterDataForDashboard
    .reduce(
      (acc, elm) => {
        const budgetedAmount = budgetedExpense[elm.id]
          .reduce((a, e) => a + Number(e.value), 0);
        const actualSpent = (elm?.id in actualTransactions) ?
          actualTransactions[elm.id]
            .reduce((a, e) => e.transactionTypeName == 'Expense' ? a + Number(e.amount) : a, 0)
          : 0;
        return ({
          ...acc,
          [elm.id]: {
            actualSpent,
            budgetedAmount,
          }
        })
      },
      accumulator
    );
};
