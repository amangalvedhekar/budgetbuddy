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
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const transactionLists = useSelector((state: RootState) => state.transactionList);
  const actualTransactions = transactionLists[currentYear] ?? {};


  useScrollToTop(scrollViewRef);

  const actualExpenseTransaction = currentMonth in actualTransactions ? actualTransactions[currentMonth].filter(trx => trx.transactionType == 1):[];
  const actualIncomeTransaction = currentMonth in actualTransactions ? actualTransactions[currentMonth].filter(trx => trx.transactionType == 0):[];
  const actualIncomeTotal = actualIncomeTransaction
    .reduce((acc, elm) => acc + Number(elm.amount), 0);
  const actualExpenseTotal = actualExpenseTransaction
    .reduce((acc, elm) => acc + Number(elm.amount), 0);
  const budgetedExpenseTotal = budgetedExpense[currentMonth]
    .reduce((acc, elm) => acc + Number(elm.value), 0);
  const expectedIncomeTotal = expectedIncome[currentMonth]
    .reduce((acc, elm) => acc + Number(elm.value), 0);
  const formattedAmount = (value) => new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(value);
console.log(actualIncomeTransaction)
  const barData = [
    {
      label: 'Income Expected',
      value: expectedIncomeTotal,
      frontColor: 'green'
    },
    {
      label: 'Income Actual',
      value: actualIncomeTotal,
      frontColor: 'green'
    },

    {
      label: 'Expense Expected',
      value: budgetedExpenseTotal,
      frontColor: 'red'
    },

    {
      label: 'Expense Actual',
      value: actualExpenseTotal,
      frontColor: 'red'
    },
  ];
const budgetSummarySubTitle = (expenseBudgeted, expenseActual) => {
  if(expenseBudgeted > expenseActual) {
    return {
      color: 'green',
      text: 'You are on track of your budget',
      amountLeftToSpend: Number(expenseBudgeted) - Number(expenseActual)
    };
  } else if(expenseActual > expenseBudgeted) {
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
               <H5 color={subtitle.color}>
                 {subtitle.text}
               </H5>
             </XStack>
             <XStack>
               <H5 color={subtitle.color}>
                 {formattedAmount(subtitle.amountLeftToSpend)} left to spend
               </H5>
             </XStack>
           </YStack>
          </Card.Header>
          <YStack marginHorizontal="$1">
            <BarChart
              labelWidth={96}
              labelsExtraHeight={150}
              height={350}
              labelsDistanceFromXaxis={32}
              topLabelTextStyle={{color: colors.text}}
              rotateLabel
              noOfSections={4}
              yAxisLabelWidth={72}
              barWidth={64}
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
              autoCenterTooltip
              renderTooltip={(item) => <Paragraph color={['Expense Expected','Expense Actual'].includes(item.label) ? 'red' : 'green'}>{new Intl.NumberFormat('en-CA', {
                style: 'currency',
                currency: 'CAD'
              }).format(item.value)}</Paragraph>}
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
