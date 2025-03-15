import {Button, Card, H2, H3, H5, Input, ScrollView, useWindowDimensions, XStack} from "tamagui";
import {useAuth, useDb} from "../../hooks";
import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {createRef, useCallback, useEffect, useRef, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {eq, and} from "drizzle-orm";

import {KeyboardStickyView, KeyboardAvoidingView} from "react-native-keyboard-controller";
import {DeviceEventEmitter, Keyboard, TextInput} from "react-native";
import {DropDown} from "../../components/DropDown";

export const PlannedBudget = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const {params} = useRoute();
  const {navigate, setOptions} = useNavigation();
  const [abc, setAbc] = useState();
  const inputRefList = useRef<TextInput[]>([]);
  const showSuccessToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Budgeted Expense updated for ${params?.selectedMonth.month}`,
      type: 'success'
    });
  };

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
      }).from(BudgetedData).where(and(
        eq(BudgetedData.userId, ab?.userId ?? ''),
        eq(BudgetedData.month, params?.selectedMonth?.id)
      ));
      if (Array.isArray(def) && def.length !== 0) {
        const existingItem = def
          .map(d => {
            const foundItem = dataToSave
              .find(f => f.categoryType == d.id && d.userId == ab?.userId)
            if (foundItem) {
              return foundItem;
            }
          }).filter(Boolean);
        await Promise.all(existingItem.map(async (item) => {
          try {
            await db.update(BudgetedData).set({
              value: item.value,
            }).where(and(
              eq(BudgetedData.categoryType, item.categoryType),
              eq(BudgetedData.userId, ab?.userId),
              eq(BudgetedData.month, params?.selectedMonth?.id)
            ));
          } catch (e) {
            console.warn(e, 'error')
          }
        }))
      } else {
        await db.insert(BudgetedData).values(dataToSave);
        console.log(dataToSave, 'is')
      }
      showSuccessToast();
      navigate('accountEntry');
    } catch (e) {
      console.log(JSON.stringify(e), 'err happened')
    }
  }
  return (
    <>
      <H5 textAlign="center" marginVertical="$2">
        {params?.selectedMonth.month} Budgeted Expenses
      </H5>

      <ScrollView
        marginBottom="$4"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          paddingBottom: 16,
          marginBottom: 16,
          flexGrow: 1
        }}
      >
        <KeyboardAvoidingView behavior="padding">
          {abc?.map((a, idx) => (
            <Card
              key={a.name}
              elevate
              margin="$2"
              borderRadius="$8"
              size="$3"
            >
              <Card.Header>
                <XStack alignItems="center">
                  <H5 flex={0.7} paddingLeft="$2">
                    {a.name}
                  </H5>
                  <Input
                    flex={0.3}
                    ref={(elm) => inputRefList.current[idx] = elm}
                    size="$5"
                    placeholder="0.00"
                    keyboardType="numeric"
                    returnKeyType="done"
                    borderWidth="$1"
                    value={a?.value == '0' ? '':a?.value?.toString()}
                    onChangeText={handleChangeText(a.name)}
                    onSubmitEditing={() => {
                      if (idx < abc?.length) {
                        inputRefList.current[idx + 1]?.focus()
                      }
                    }}
                  />
                </XStack>
              </Card.Header>
              {/*<Card.Footer>*/}
              {/*  <XStack*/}
              {/*    justifyContent="center"*/}
              {/*    paddingHorizontal="$4"*/}
              {/*    paddingBottom="$2"*/}
              {/*  >*/}
              {/*  <DropDown*/}
              {/*    items={*/}
              {/*    ["Doesn't repeat", 'Bi-weekly', 'Monthly']*/}
              {/*  }*/}
              {/*    val={''}*/}
              {/*    setVal={() => {}}*/}
              {/*    placeholder="Frequency"*/}
              {/*  />*/}
              {/*  </XStack>*/}
              {/*</Card.Footer>*/}
            </Card>
          ))}
        </KeyboardAvoidingView>
      </ScrollView>
      <KeyboardStickyView
        offset={{
          opened: 110
        }}
        style={{backgroundColor: useTheme().colors.background}}
      >
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