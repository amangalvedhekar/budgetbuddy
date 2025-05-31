import {useScrollToTop, useTheme} from "@react-navigation/native";
import {useRef, useState} from "react";
import {XStack, H2, H5, ScrollView, useWindowDimensions, YStack, Paragraph, Card, H4, H3} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


export const Home = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const scrollViewRef = useRef<ScrollView>();
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const transactionLists = useSelector((state: RootState) => state.transactionList);
  const actualTransactions = transactionLists[currentYear] ?? {};


  useScrollToTop(scrollViewRef);

  const actualExpenseTransaction = currentMonth in actualTransactions ? actualTransactions[currentMonth].filter(trx => trx.transactionType == 1) : [];
  const actualIncomeTransaction = currentMonth in actualTransactions ? actualTransactions[currentMonth].filter(trx => trx.transactionType == 0) : [];
  const actualIncomeTotal = actualIncomeTransaction
    .reduce((acc, elm) => acc + Number(elm.amount), 0);
  const actualExpenseTotal = actualExpenseTransaction
    .reduce((acc, elm) => acc + Number(elm.amount), 0);
  const budgetedExpenseTotal = budgetedExpense[currentMonth]
    .reduce((acc, elm) => acc + Number(elm.value), 0);
  const expectedIncomeTotal = expectedIncome[currentMonth]
    .reduce((acc, elm) => acc + Number(elm.value), 0);
  const maxAmount = [actualExpenseTotal, actualIncomeTotal, budgetedExpenseTotal, expectedIncomeTotal]
    .reduce((acc, elm) => Math.max(acc, Number(elm)), 0)
  const formattedAmount = (value) => new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);

  const barData = [
    {
      label: 'Income',
      value: expectedIncomeTotal,
      data: 'Expected Income',
      frontColor: 'green',
      spacing: 1,
    },
    {
      data: 'Actual Income',
      value: actualIncomeTotal,
      frontColor: 'green'
    },

    {
      label: 'Expense',
      data: 'Budgeted Expense',
      value: budgetedExpenseTotal,
      frontColor: 'red',
      spacing: 1,
    },

    {
      data: 'Actual Expense',
      value: actualExpenseTotal,
      frontColor: 'red',
    },
  ];
  const budgetSummarySubTitle = (expenseBudgeted, expenseActual) => {
    if (expenseBudgeted > expenseActual) {
      return {
        color: 'green',
        text: 'You are on track of your budget',
        amountLeftToSpend: Number(expenseBudgeted) - Number(expenseActual)
      };
    } else if (expenseActual > expenseBudgeted) {
      return {
        color: 'red',
        text: 'You went over budget',
        amountLeftToSpend: Number(expenseBudgeted) - Number(expenseActual)
      }
    } else {
      return {
        color: 'yellow',
        text: 'Not enough data',
        amountLeftToSpend: 'N/A'
      }
    }
  }
  const subtitle = budgetSummarySubTitle(budgetedExpenseTotal, actualExpenseTotal)
  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{paddingBottom: 72, marginBottom: 24}}
      >
        <Card
          margin="$2"
          borderRadius="$8"
        >
          <Card.Header>
            <YStack>
              <XStack marginVertical="$1">
                <H4 opacity={0.6}>
                  Budget Summary
                </H4>
              </XStack>
              <XStack marginVertical="$1">
                <H3>
                  {filterDataForDashboard[currentMonth].name} {currentYear}
                </H3>
              </XStack>
              <XStack>
                <H3 color={subtitle.color}>
                  {subtitle.text}
                </H3>
              </XStack>
              <XStack>
                <H3 color={subtitle.color}>
                  {formattedAmount(subtitle.amountLeftToSpend)} left to spend
                </H3>
              </XStack>
            </YStack>
          </Card.Header>
          <YStack marginHorizontal="$1" marginVertical="$2">
            <BarChart
              labelsExtraHeight={90}
              labelsDistanceFromXaxis={32}
              topLabelTextStyle={{color: colors.text}}
              noOfSections={4}
              maxValue={maxAmount + 9000}
              yAxisLabelWidth={72}
              width={width - 40}
              barWidth={56}
              barBorderRadius={8}
              frontColor={colors.text}
              yAxisTextStyle={{
                color: colors.text
              }}
              xAxisLabelTextStyle={{
                color: colors.text,
              }}
              data={barData}
              yAxisThickness={0}
              xAxisThickness={0}
              renderTooltip={(item) =>
                <YStack>
                  <Paragraph>
                    {new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(item.value)}</Paragraph>
                  <H5>
                    {item?.data}
                  </H5>
                </YStack>
              }
            />
          </YStack>
          {/*<Card.Footer marginHorizontal="$1" marginBottom="$4">*/}
          {/* <XStack*/}
          {/*   justifyContent="center"*/}
          {/*   alignItems="center"*/}
          {/*   flex={1}*/}
          {/* >*/}
          {/*   <H4>*/}
          {/*     See full budget for May*/}
          {/*   </H4>*/}
          {/* </XStack>*/}
          {/*</Card.Footer>*/}
        </Card>
      </ScrollView>
    </>
  )
};
