import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {useCallback, useContext, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {and, eq} from "drizzle-orm";
import {Button, H5, ScrollView, useWindowDimensions, YStack} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";
import {ToastContext} from "../../contexts/Toast/ToastProvider";

export const Home = () => {
  const {db} = useDb();

  const {ab} = useAuth();
  const {params} = useRoute();
  const {navigate} = useNavigation();
  const [abc, setAbc] = useState();
  const [pieData, setPieData] = useState();
  const [selectedPie, setSelectedPie] = useState();
  const [barData, setBarData] = useState();
  const {colors} = useTheme();
  const {width, height} = useWindowDimensions();
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc1 = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
      }).from(BudgetedData).where(and(
        eq(BudgetedData.userId, ab?.userId ?? ''),
        eq(BudgetedData.month, 0)
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
      // console.log(dataForIncome, 'hmm')
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

      const abc = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
      }).from(BudgetedData).where(and(
        eq(BudgetedData.userId, ab?.userId ?? ''),
        eq(BudgetedData.month, 0)
      ));
      const def = await db.select({
        id: CategoriesSchema.id,
        name: CategoriesSchema.categoryName
      }).from(CategoriesSchema).where(eq(CategoriesSchema.transactionType, "1"));
      const dataForExpense = def.map(d => {
        const found = abc.find(b => b.id == d.id);
        if (found) {
          return {
            ...d,
            value: found.value,
          };
        }
      }).filter(Boolean);
      // console.log(dataForExpense, 'hmm')
      if (Array.isArray(dataForExpense) && dataForExpense.length === 0) {
        const freshData = def.map(d => ({
          ...d,
          value: '',
        }));
        setAbc(freshData)
      } else {
        const def = await Promise.all(dataForExpense.map(async (d) => {
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
        setAbc(def);
        const pieD = def.map((d, i) => ({
          ...d,
          text: d.name,
          color: `#${Math.random().toString(16).slice(-6)}`
          // color: `#8000${i}${i}`
        }));
        setPieData(pieD);
      }
    })();
  }, []));

  const calculateTotal = () => {
    const total = Array.isArray(abc) ? abc.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };
  const calculateIncomeTotal = () => Array.isArray(barData) ? barData.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
const {show} = useContext(ToastContext)
  const formatTotal = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(calculateIncomeTotal());
  return (
    <>
      <ScrollView>
        <YStack justifyContent="center" alignItems="center" marginVertical="$2">
          {pieData?.length > 0 && (<>
            <H5>
              Budgeted Expense for January
            </H5>
            <PieChart
              radius={(width / 2) - 40}
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
              data={pieData ?? []}
            />
          </>)}
          {Array.isArray(barData) && barData?.length > 0 && calculateIncomeTotal() > 0 && (
            <>
              <H5 padding="$1">
                Expected Income for January
              </H5>
              <BarChart
                showValuesAsTopLabel
                maxValue={15000}
                topLabelContainerStyle={{
                  paddingTop: 8
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
      <YStack padding="$3" justifyContent="flex-end">
        <Button
          bordered
          elevate
          themeInverse
          onPress={() => navigate('Insight')}
        >
          Get More Insights - Coming Soon
        </Button>
      </YStack>
    </>
  )
};
