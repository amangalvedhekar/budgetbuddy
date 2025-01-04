import {Button, Card, H3, H5, Input, ScrollView, XStack} from "tamagui";
import {useAuth, useDb} from "../../hooks";
import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {eq, and} from "drizzle-orm";

import {KeyboardStickyView, KeyboardAvoidingView} from "react-native-keyboard-controller";

export const PlannedBudget = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const {params} = useRoute();
  const {navigate, setOptions} = useNavigation();
  const [abc, setAbc] = useState();
  useFocusEffect(useCallback(() => {
    (async () => {
      setOptions({
        headerTitle: `Planned Budget for ${params?.selectedMonth.month}`
      })
      const abc = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
      }).from(BudgetedData).where(and(
        eq(BudgetedData.userId, ab?.userId ?? ''),
        eq(BudgetedData.month, params?.selectedMonth?.id)
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
      }
    })();
  }, []));
  const offset = {closed: 0, opened: 80};

  const handleChangeText = (a) => (b) => {
    const newData = abc.map(d => {
      if (d.name == a) {
        return {
          ...d,
          value: b
        }
      } else {
        return d;
      }
    });
    setAbc(newData);
  }

  const calculateTotal = () => {
    const total = Array.isArray(abc) ? abc.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };

  const saveBudgetedData = async () => {
    try {
      const dataToSave = abc.map(d => (
        {
          categoryType: d.id,
          userId: ab?.userId,
          value: Number(d.value) ?? 0,
          month: params?.selectedMonth?.id
        }
      ));
      const def = await db.select({
        id: BudgetedData.categoryType,
        value: BudgetedData.value,
        userId: BudgetedData.userId,
      }).from(BudgetedData).where(eq(BudgetedData.userId, ab?.userId ?? ''));
      if (Array.isArray(def) && def.length !== 0) {
        const existingItem = def
          .map(d => {
            const foundItem = dataToSave
              .find(f => f.categoryType == d.id && d.userId == ab?.userId)
            if (foundItem) {
              return foundItem;
            }
          });
        console.log(existingItem, 'what is')
        await Promise.all(existingItem.map(async (item) => {
          console.log(item, 'in iteration item is', ab?.userId,)
          try {
            const x = await db.update(BudgetedData).set({
              value: item.value,
              month: params?.selectedMonth?.id
            }).where(and(
              eq(BudgetedData.categoryType, item.categoryType),
              eq(BudgetedData.userId, ab?.userId),
            )).returning();
            console.log(x, 'updated data')
          } catch (e) {

          }
        }))
      } else {
        await db.insert(BudgetedData).values(dataToSave);
      }
      navigate('accountEntry');
    } catch (e) {
      console.log(JSON.stringify(e), 'err happened', e)
    }
  }

  return (
    <>
      <H5 textAlign="center" marginVertical="$2">
        {params?.selectedMonth.month} Budgeted Expenses
      </H5>

      <ScrollView>
        <KeyboardAvoidingView behavior="padding">
          {abc?.map(a => (
            <Card key={a.name} elevate
                  margin="$2"
                  bordered
                  borderRadius="$9"
                  size="$3"
                  animation="bouncy"
                  scale={0.9}
                  hoverStyle={{scale: 0.975}}
                  pressStyle={{scale: 0.975}}>
              <Card.Header>
                <XStack alignItems="center">
                  <H5 flex={0.7}>
                    {a.name}
                  </H5>
                  <Input
                    flex={0.3}
                    size="$6"
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={a?.value?.toString()}
                    onChangeText={handleChangeText(a.name)}
                  />
                </XStack>
              </Card.Header>
            </Card>
          ))}
        </KeyboardAvoidingView>
      </ScrollView>
      <KeyboardStickyView offset={offset} style={{backgroundColor: useTheme().colors.background}}>
        <XStack flexWrap="wrap" alignItems="center" justifyContent="space-between" margin="$2">
          <H5>
            Total Amount:
          </H5>
          <H3>
            {calculateTotal()}
          </H3>
          <Button elevate size="$4" onPress={saveBudgetedData}>
            Save
          </Button>
        </XStack>
      </KeyboardStickyView>
    </>
  );
}