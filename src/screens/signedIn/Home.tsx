import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {and, eq} from "drizzle-orm";
import {H5, ScrollView, useWindowDimensions, XStack, YStack} from "tamagui";
import {BarChart, PieChart} from "react-native-gifted-charts";

export const Home = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const {params} = useRoute();
  const [abc, setAbc] = useState();
  const [pieData, setPieData] = useState();
  const [selectedPie, setSelectedPie] = useState();
  const [barData, setBarData] = useState();
  // const barData = [
  //   {value: 12019, label: 'Pay Cheque',},
  //   {value: 18000, label: 'Bonus',},
  //   {value: 500, label: 'Dividend',},
  //   {value: 90, label: 'Distribution'},
  //
  // ];
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
      console.log(dataForIncome, 'hmm')
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
      console.log(dataForExpense, 'hmm')
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
  const {colors} = useTheme();
  const calculateTotal = () => {
    const total = Array.isArray(abc) ? abc.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };

  return (
    <ScrollView>
      <YStack justifyContent="center" alignItems="center" marginVertical="$2">
        <H5>
          Budgeted Expense for January
        </H5>
        <PieChart
          radius={(width/2) - 20}
          donut
          showTooltip
          innerCircleColor={colors.card}
          onPress={setSelectedPie}
          centerLabelComponent={() => (
            <YStack flex={1} textWrap="wrap" alignItems="center" justifyContent="center">
              {selectedPie != undefined ? <>
                <H5>{selectedPie?.name}</H5>
                <H5>{new Intl.NumberFormat('en-CA', {
                  style: 'currency',
                  currency: 'CAD'
                }).format(selectedPie?.value)}</H5>
              </>: <>
                <H5 textWrap="balance">Total expense</H5>
                <H5>{calculateTotal()}</H5>
              </>}
            </YStack>
          )}
          // tooltipComponent={}
          // textBackgroundRadius={23}
          data={pieData ?? []}
        />
        <H5 padding="$3">
          Expected Income for January
        </H5>
        <XStack flex={1}>
          {Array.isArray(barData) && barData.length > 0 && (<BarChart
            showValuesAsTopLabel
            topLabelContainerStyle={{
              paddingTop: 8

            }}
            height={height > width ? height/3 : height}
            topLabelTextStyle={{
              color: colors.text
            }
            }
            barWidth={(width -120)/barData?.length}
            noOfSections={3}
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
          />)}
        </XStack>
      </YStack>
    </ScrollView>
  )
};
