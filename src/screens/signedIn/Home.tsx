import {useScrollToTop, useTheme} from "@react-navigation/native";
import React, {Fragment, useRef, useState} from "react";
import {
  XStack,
  H2,
  H5,
  ScrollView,
  useWindowDimensions,
  YStack,
  Paragraph,
  Card,
  H4,
  H3,
  Separator,
  Progress,
  Accordion,
  Square
} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {ChevronDown, ChevronRight, ChevronUp} from "../../icons";
import {StyleSheet} from "react-native";
import {CardWithProgress} from "../../components/CardWithProgress";


const dummyData = [
  {
    id: '1',
    actualSpent: 350,
    categoryName: 'Grocery',
    budgetedAmount: 450,
  },
  {
    id: '2',
    actualSpent: 250,
    categoryName: 'Uber Eats/Doordash',
    budgetedAmount: 550,
  },
  {
    id: '3',
    actualSpent: 44.9,
    categoryName: 'Lyft',
    budgetedAmount: 55,
  }
];

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
  const {width} = useWindowDimensions();
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



  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{paddingBottom: 72, marginBottom: 24}}
      >
        <XStack marginHorizontal="$3">
          <DropDown
            items={filterDataForDashboard}
            val={month}
            setVal={setMonth}
            placeholder="Select Month"
          />
        </XStack>
        <XStack
          marginHorizontal="$3"
          marginVertical="$2"
          justifyContent="space-between"
          alignItems="center"
        >
          <H4>
            Expense
          </H4>
          <H4 color="green">
            $200 left to spend
          </H4>
          <ChevronUp
            color={colors.text}
            height={32}
            width={32}
          />
        </XStack>
        {dummyData.map(data => (
          <CardWithProgress
            key={data.id}
            headingTitle={data.categoryName}
            actualSpent={data.actualSpent}
            budgetedAmount={data.budgetedAmount}
          />
        ))}
      </ScrollView>
    </>
  )
};
