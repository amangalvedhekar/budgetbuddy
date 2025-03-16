import {useFocusEffect, useScrollToTop, useTheme} from "@react-navigation/native";
import {useCallback, useRef, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {and, eq} from "drizzle-orm";
import {XStack, H2, H5, ScrollView, useWindowDimensions, YStack} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


export const Home = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const [selectedPie, setSelectedPie] = useState();
  const [barData, setBarData] = useState();
  const {colors} = useTheme();
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const [month, setMonth] = useState(() => filterDataForDashboard[0]);
  const {width} = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>();
  useScrollToTop(scrollViewRef);
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc1 = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
      }).from(BudgetedData).where(and(
        eq(BudgetedData.userId, ab?.userId ?? ''),
        eq(BudgetedData.month, month.id)
      ));
      const def1 = await db.select({
        id: CategoriesSchema.id,
        label: CategoriesSchema.categoryName
      }).from(CategoriesSchema).where(eq(CategoriesSchema.transactionType, "0"));
      const dataForIncome = def1.map(d => {
        const found = abc1.find(b => b.id == d.id)
        if (found) {
          return {...d, value: found.value};
        }
      }).filter(Boolean);
      if (Array.isArray(dataForIncome) && dataForIncome.length === 0) {
        const freshData = def1.map(d => ({
          ...d,
          value: '',
        }));
        setBarData(freshData)
      } else {
        const defd = await Promise.all(dataForIncome.map(async (d) => {
          try {
            const h = await db.select({
              name: CategoriesSchema.categoryName
            }).from(CategoriesSchema).where(eq(CategoriesSchema.id, d.id));
            return {
              ...d,
              name: h[0].name
            };
          } catch (e) {

          }
        }));
        setBarData(defd);
      }
    })();
  }, [month]));
  const calculateTotal = () => {
    const total = Array.isArray(budgetedExpense[month.id]) ? budgetedExpense[month.id].reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };
  const calculateIncomeTotal = () => Array.isArray(barData) ? barData.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
  const maxAmount = () => Array.isArray(barData) ? barData.reduce((acc, elm) => Math.max(acc, Number(elm.value)), 0) : 0
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
              radius={(width / 2) - 64}
              donut
              showTooltip
              innerCircleColor={colors.card}
              onPress={setSelectedPie}
              centerLabelComponent={() => (
                <YStack flex={1} textWrap="wrap" alignItems="center" justifyContent="center">
                  {selectedPie != undefined ? <>
                    <H5>{selectedPie?.name}</H5>
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
              data={budgetedExpense[month.id]}
            />
          </>)}
          {Array.isArray(barData) && barData?.length > 0 && calculateIncomeTotal() > 0 && (
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
                barWidth={(width - 200) / barData?.length}
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
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
              />
            </>)}
        </YStack>
      </ScrollView>
    </>
  )
};
