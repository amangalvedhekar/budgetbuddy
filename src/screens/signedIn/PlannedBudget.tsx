import {Button, Card, H2, H3, H5, Input, ScrollView, useWindowDimensions, XStack} from "tamagui";
import {useAuth, useDb} from "../../hooks";
import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {createRef, useCallback, useEffect, useRef, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {eq, and} from "drizzle-orm";

import {KeyboardStickyView, KeyboardAvoidingView} from "react-native-keyboard-controller";
import {DeviceEventEmitter, Keyboard, TextInput} from "react-native";
import {DropDown} from "../../components/DropDown";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {getBudgetedExpenseForMonth, setBudgetedExpenseForMonth} from "../../dbOperations/budgetedExpense";
import {setBudgetedExpense} from "../../features/budgetedExpenseSlice";

export const PlannedBudget = () => {
  const {db} = useDb();
  const {ab} = useAuth();
  const {params} = useRoute();
  const {navigate} = useNavigation();
  const inputRefList = useRef<TextInput[]>([]);
  const dispatch = useDispatch();
  const budgetedData = useSelector((state: RootState) => state.budgetedExpense);
  const budgetedDataForSelectedMonth = budgetedData[params?.selectedMonth?.id];
  const [updated, setUpdatedData] = useState(() => budgetedDataForSelectedMonth);
  const showSuccessToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Budgeted Expense updated for ${params?.selectedMonth.month}`,
      type: 'success'
    });
  };

  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        await getBudgetedExpenseForMonth({
          userId: (ab?.userId as unknown as typeof BudgetedData.userId),
          month: (params?.selectedMonth?.id as unknown as typeof BudgetedData.month),
          dispatch
        });
      }catch (e) {
        console.log(JSON.stringify(e), 'error while retrieving budgeted data')
      }
    })();
  }, []));

  const handleChangeText = (a) => (b) => {
    const newData = updated.map(d => {
      if (d.name == a) {
        return {
          ...d,
          value: b
        }
      } else {
        return d;
      }
    });
    setUpdatedData(newData);
  }

  const calculateTotal = () => {
    const total = Array.isArray(updated) ? updated.reduce((acc, elm) => acc + Number(elm.value), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  };

  const saveBudgetedData = async () => {
    try {
      await setBudgetedExpenseForMonth({
        dataToSet: updated,
        userId: ab?.userId,
        month: params?.selectedMonth?.id,
        dispatch,
      })
      showSuccessToast();
      navigate('accountEntry');
    } catch (e) {
      console.log(JSON.stringify(e), 'err happened')
    }
  }

  return (
    <>
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
          {updated?.map((a, idx) => (
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
                    value={a?.value == '0' ? '' : a?.value?.toString()}
                    onChangeText={handleChangeText(a.name)}
                    onSubmitEditing={() => {
                      if (idx < updated?.length) {
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
              {/*    val='Bi-weekly'*/}
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