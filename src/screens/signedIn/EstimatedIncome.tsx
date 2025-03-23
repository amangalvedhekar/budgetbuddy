import {useFocusEffect, useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {BudgetedData, Categories as CategoriesSchema} from "../../../schema";
import {and, eq,} from "drizzle-orm";
import {useAuth, useDb} from "../../hooks";
import {Button, Card, H3, H5, Input, ScrollView, useWindowDimensions, XStack} from "tamagui";
import {KeyboardAvoidingView, KeyboardStickyView} from "react-native-keyboard-controller";
import {calculateTotalInputted} from "../../utils/calculateTotalInputted";
import {DeviceEventEmitter} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {getExpectedIncomeForMonth, setExpectedIncomeForMonth} from "../../dbOperations/expectedIncome";

export const EstimatedIncome = () => {
  const {db} = useDb();
  const { navigate} = useNavigation();
  const {params} = useRoute();
  const {ab} = useAuth();
  const dispatch = useDispatch();
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const expectedIncomeForSelectedMonth = expectedIncome[params?.selectedMonth?.id];
  const [incomeStream, setIncomeStream] = useState(() => expectedIncomeForSelectedMonth);
  const showSuccessToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Expected Income updated for ${params?.selectedMonth.month}`,
      type: 'success'
    });
  };
  useFocusEffect(useCallback(() => {
    (async () => {
      try {
        await getExpectedIncomeForMonth({
          userId: ab?.userId,
          month: (params?.selectedMonth?.id as unknown as typeof BudgetedData.month),
          dispatch
        })
      }catch (e) {
        console.error(JSON.stringify(e), 'err happened')
      }
      }
    )();
  }, []));

  const handleChangeText = (a) => (b) => {
    const newData = incomeStream?.map(d => {
      if (d.name == a) {
        return {
          ...d,
          value: b,
        };
      } else {
        return d;
      }
    });
    setIncomeStream(newData);
  }

  const saveEstimatedIncomeData = async () => {
    try {
      await setExpectedIncomeForMonth({
        dataToSet: incomeStream,
        userId: ab?.userId,
        month: params?.selectedMonth?.id,
        dispatch,
      })
      showSuccessToast();
      navigate('accountEntry');
    } catch (e) {
      console.log(JSON.stringify(e), 'error while saving income')
    }
  }

  return (
    <>
    <ScrollView automaticallyAdjustKeyboardInsets>
      <KeyboardAvoidingView behavior="padding">
        {Array.isArray(incomeStream) && incomeStream.map(stream => (
          <Card
            key={stream.categoryId}
            elevate
            margin="$2"
            size="$3"
            borderRadius="$8"
          >
            <Card.Header>
              <XStack alignItems="center">
                <H5 flex={0.7} paddingLeft="$2">
                  {stream.name}
                </H5>
                <Input
                  flex={0.3}
                  size="$5"
                  placeholder="0.00"
                  keyboardType="numeric"
                  returnKeyType="done"
                  value={stream?.value ?stream?.value?.toString(): ''}
                  onChangeText={handleChangeText(stream?.name)}
                  borderWidth="$1"
                />
              </XStack>
            </Card.Header>
          </Card>))}
      </KeyboardAvoidingView>
    </ScrollView>
      <KeyboardStickyView
        offset={{
          opened: 110
        }}
        style={{backgroundColor: useTheme().colors.background}}
      >
        <XStack
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          margin="$2"

        >
          <H5>
            Total Amount:
          </H5>
          <H5 color="green">
            {calculateTotalInputted({inputList: incomeStream, currency: 'en-CA'})}
          </H5>
          <Button elevate size="$4" onPress={saveEstimatedIncomeData}>
            Save
          </Button>
        </XStack>
      </KeyboardStickyView>

    </>
  );
}