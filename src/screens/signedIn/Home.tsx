import {useScrollToTop, useTheme} from "@react-navigation/native";
import React, {useLayoutEffect, useRef, useState} from "react";
import {
  XStack,
  ScrollView, H5,
  H4, YStack,
} from "tamagui";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Check, Cross, Warning} from "../../icons";

import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {BannerContainer} from "../../components/Banner/Container";
import {getBudgetedAndActualAmount} from "../../utils/getExpensesForMonth";

const data = [
  {
    text: 'Great job on staying within budget for subscriptions 🎉',
    icon: <Check color="green"/>,
    color: 'green'
  },
  {
    text: 'Your income came lower than expected for dividends.',
    icon: <Warning color="#8B8000"/>,
    color: '#8B8000'
  },
  {
    text: 'You spent more than budgeted in Doordash/Uber Eats.',
    icon: <Cross color="red"/>,
    color: 'red'
  },];

export const Home = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const transactionLists = useSelector((state: RootState) => state.transactionList);
  const actualTransactions = transactionLists[currentYear] ?? {};
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const [month, setMonth] = useState<Record<'name' | 'id', number | string>>(() => filterDataForDashboard[currentDate.getMonth()]);
  const scrollViewRef = useRef<ScrollView>();
  useScrollToTop(scrollViewRef);
  const {colors} = useTheme();
  const budgetExpenseForMonth = month ? budgetedExpense[month.id] : [];

  const calculateTotal = () => {
    const total = Array.isArray(budgetExpenseForMonth) ? budgetExpenseForMonth.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };
  const calculateIncomeTotal = () => Array.isArray(expectedIncome[month.id]) ? expectedIncome[month.id].reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
  const maxAmount = () => Array.isArray(expectedIncome[month.id]) ? expectedIncome[month.id].reduce((acc, elm) => Math.max(acc, Number(elm.value)), 0) : 0
  const formatTotal = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(calculateIncomeTotal());
  const [height, setHeight] = useState<number>(0);
  const budgetedToActual = getBudgetedAndActualAmount({budgetedExpense, actualTransactions});
  console.log(budgetedToActual[month.id], 'what is this', height);
  const handleLayout = (e) => {
    setHeight(e.nativeEvent.layout.height);
  }
  return (
    <>
      <XStack marginHorizontal="$3" onLayout={e => console.log(e.nativeEvent.layout.height, 'heigh of dropdown')}>
        <DropDown
          items={filterDataForDashboard}
          val={month}
          setVal={setMonth}
          placeholder="Select Month"
        />
      </XStack>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{paddingBottom: 72, marginBottom: 24}}
      >

        <XStack marginHorizontal="$3" marginVertical="$2">
          <H4>
            Budgeted to Actual Expense
          </H4>
        </XStack>

        <BannerContainer
          data={data}
          titleHeader="Expense"
          titleMiddleHeader={budgetedToActual[month.id]}
          onLayout={handleLayout}
        />


      </ScrollView>
    </>
  )
};
