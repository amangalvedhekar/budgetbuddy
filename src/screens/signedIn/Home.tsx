import { useScrollToTop, useTheme} from "@react-navigation/native";
import { useRef, useState} from "react";
import {XStack, H2, H5, ScrollView, useWindowDimensions, YStack, Paragraph} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


export const Home = () => {
  const [selectedPie, setSelectedPie] = useState();
  const {colors} = useTheme();
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const [month, setMonth] = useState<Record<'name'| 'id', number | string>>(() => filterDataForDashboard[0]);
  const {height, width} = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>();
  useScrollToTop(scrollViewRef);

  const budgetExpenseForMonth = month ? budgetedExpense[month.id] : [];

  const calculateTotal = () => {
    const total = Array.isArray(budgetedExpense[month.id]) ? budgetedExpense[month.id].reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
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
        contentContainerStyle={{paddingBottom: 72}}
      >
        <XStack marginHorizontal="$3">
          <DropDown
            items={filterDataForDashboard}
            val={month}
            setVal={setMonth}
            placeholder="Select Duration"
          />
        </XStack>
        <YStack justifyContent="center" alignItems="center" marginVertical="$2">
          {Array.isArray(budgetedExpense[month.id]) && budgetedExpense[month.id]?.length > 0 && calculateTotal() != '$0.00' && (<>
            <H5>
              Budgeted Expense for {month.name}
            </H5>
            <H2 color="red">
              {calculateTotal()}
            </H2>
            <PieChart
              radius={height > width ? ((width-64) / 2) : ((height-64) / 2)}
              donut
              showTooltip
              innerCircleColor={colors.card}
              onPress={setSelectedPie}
              centerLabelComponent={() => (
                <YStack flex={1} textWrap="wrap" alignItems="center" justifyContent="center">
                  {selectedPie != undefined ? <>
                    <H5 textWrap="wrap">{selectedPie?.name}</H5>
                    <H5 color="red">{new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(selectedPie?.value)}</H5>
                  </> : <>
                    <H5 textWrap="balance">Total expense</H5>
                    <H5 color="red">{calculateTotal()}</H5>
                  </>}
                </YStack>
              )}
              labelsPosition="outward"
              data={budgetExpenseForMonth}
            />
          </>)}
          {Array.isArray(expectedIncome[month.id]) && expectedIncome[month.id]?.length > 0 && calculateIncomeTotal() > 0 && (
            <>
              <H5 paddingTop="$2">
                Expected Income for {month.name}
              </H5>
              <H2 paddingBottom="$2" color="green">
                {formatTotal}
              </H2>
              <BarChart
                showValuesAsTopLabel
                maxValue={maxAmount() + 1000}
                topLabelContainerStyle={{
                  paddingTop: 8,
                  marginTop: 16,
                }}
                topLabelTextStyle={{color: colors.text}}
                barWidth={(width - 200) / expectedIncome[month.id]?.length}
                noOfSections={4}
                yAxisLabelWidth={64}
                barBorderRadius={8}
                frontColor={colors.text}
                yAxisTextStyle={{
                  color: colors.text
                }}
                xAxisLabelTextStyle={{
                  color: colors.text
                }}
                data={expectedIncome[month.id]}
                yAxisThickness={0}
                xAxisThickness={0}
              />
            </>)}
        </YStack>
      </ScrollView>
    </>
  )
};
