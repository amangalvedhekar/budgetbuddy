import {Card, H5, ScrollView, Separator, XStack} from "tamagui";
import {Check} from "../../icons";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useDb} from "../../hooks";
import {useCallback, useState} from "react";
import {BudgetedData} from "../../../schema";
import {eq} from "drizzle-orm";

const MONTH_LIST = [
  {
    month: 'January',
    id: 0,
    isBudgeted:false,
  },
  {
    month: 'February',
    id: 1,
    isBudgeted:false,
  },
  {
    month: 'March',
    id: 2,
    isBudgeted:false,
  },
  {
    month: 'April',
    id: 3,
    isBudgeted:false,
  },

  {
    month: 'May',
    id: 4,
    isBudgeted:false,
  },

  {
    month: 'June',
    id: 5,
    isBudgeted:false,
  },
  {
    month: 'July',
    id: 6,
    isBudgeted:false,
  },
  {
    month: 'August',
    id: 7,
    isBudgeted:false,
  },
  {
    month: 'September',
    id: 8,
    isBudgeted:false,
  },
  {
    month: 'October',
    id: 9,
    isBudgeted:false,
  },
  {
    month: 'November',
    id: 10,
    isBudgeted:false,
  },
  {
    month: 'December',
    id: 11,
    isBudgeted:false,
  },
];
export const Month = () => {
  const {navigate} = useNavigation();
  const {db} = useDb();

  const [monthData, setMonthData] = useState(() => MONTH_LIST);

  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        const results = await Promise.all(MONTH_LIST.map(async (month) => {
          const result = await db
            .query.BudgetedData.findMany({
              where: eq(BudgetedData.month, month.id)
            })
          console.log(result, 'inside focus')
          if(Array.isArray(result) && result.length > 0) {
            return ({
              ...month,
              isBudgeted: true,
            });
          }else {
            return month;
          }
        }));
        setMonthData(results);
      }catch (e) {
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
              <XStack justifyContent="space-between" onPress={() => navigate('plannedBudget', {selectedMonth: month})}>
                <H5>
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