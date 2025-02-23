import {Card, H5, ScrollView, Separator, XStack} from "tamagui";
import {Check} from "../../icons";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useAuth, useDb} from "../../hooks";
import {useCallback, useState} from "react";
import {BudgetedData, Categories} from "../../../schema";
import {and, eq} from "drizzle-orm";


const MONTH_LIST = [
  {
    month: 'January',
    id: 0,
    isBudgeted: false,
  },
  {
    month: 'February',
    id: 1,
    isBudgeted: false,
  },
  {
    month: 'March',
    id: 2,
    isBudgeted: false,
  },
  {
    month: 'April',
    id: 3,
    isBudgeted: false,
  },

  {
    month: 'May',
    id: 4,
    isBudgeted: false,
  },

  {
    month: 'June',
    id: 5,
    isBudgeted: false,
  },
  {
    month: 'July',
    id: 6,
    isBudgeted: false,
  },
  {
    month: 'August',
    id: 7,
    isBudgeted: false,
  },
  {
    month: 'September',
    id: 8,
    isBudgeted: false,
  },
  {
    month: 'October',
    id: 9,
    isBudgeted: false,
  },
  {
    month: 'November',
    id: 10,
    isBudgeted: false,
  },
  {
    month: 'December',
    id: 11,
    isBudgeted: false,
  },
];

export const Month = () => {
  const {navigate, setParams, setOptions} = useNavigation();
  const {db} = useDb();
  const {ab} = useAuth();
  const {params,} = useRoute();
  const [monthData, setMonthData] = useState(() => MONTH_LIST);

  useFocusEffect(useCallback(() => {
    (async () => {
      setOptions({
        headerTitle: params.transactionType == '0' ? 'Select month to estimate income': 'Select month to budget',
      })
      try {
        const categories = await db.query.Categories
          .findMany(
            {
              where: eq(Categories.transactionType, params.transactionType)
            }
          );
        // console.log(categories, 'categories')
        const results = await Promise.all(MONTH_LIST.map(async (month) => {
          const result = await db
            .query.BudgetedData.findMany({
              where: and(
                eq(BudgetedData.month, month.id),
                eq(BudgetedData.userId, ab?.userId??'')
              )
            })
          if (Array.isArray(result) && result.length > 0) {
            const isCategoryAdded = categories.filter(category => {
              if (result.find(r => r.categoryType == category.id)){
                return category
              }
            });
            return ({
              ...month,
              isBudgeted: Array.isArray(isCategoryAdded) && isCategoryAdded.length > 0,
            });
          } else {
            return month;
          }
        }));
        setMonthData(results);
      } catch (e) {
        console.log(e, 'hmm')
      }

    })();
  }, []))
  return (
    <>
      <ScrollView>
        <H5 margin="$2">
          2025
        </H5>
        <Separator/>
        {monthData.map(month => (
          <Card key={month.id}
                elevate
                size="$2"
                margin="$2"
          >
            <Card.Header>
              <XStack justifyContent="space-between" onPress={() => {
                if(params.transactionType == '0'){
                  navigate('addIncome', {selectedMonth: month})
                } else {
                  navigate('plannedBudget' , {selectedMonth: month})
                }
              }}>
                <H5 {...month.isBudgeted ? {color: "purple"}: null}>
                  {month.month}
                </H5>
                {month.isBudgeted ? <Check color="purple"/> : <></>}
              </XStack>
            </Card.Header>
          </Card>
        ))}
      </ScrollView>
    </>
  );
}