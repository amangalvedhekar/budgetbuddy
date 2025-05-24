import {
  Button, H5,
  Input,
  Paragraph,
  ScrollView,
  Sheet,
  YStack,
  Spinner,
} from "tamagui";
import React, {useCallback, useRef, useState} from "react";
import {DeviceEventEmitter, TextInput} from "react-native";
import {useFocusEffect, useNavigation, useTheme} from "@react-navigation/native";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {useAuth, useDb} from "../../hooks";
import {CalendarIcon, Plus} from "../../icons";
import {Calendar, DateData} from "react-native-calendars";
import {Categories as CategoriesSchema} from "../../../schema";
import {DropDown} from "../../components/DropDown";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {insertTransactionForUser} from "../../dbOperations/transactionList";
import {frequencyList} from "../../utils/frequency";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";

export const Add = () => {
  const showSuccessToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Transaction added successfully`,
      type: 'success',
    });
  };
  const showWarningToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Transaction added successfully but with some issues`,
      type: 'warning',
    });
  };
  const showErrorToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Something went wrong adding transaction`,
      type: 'error',
    });
  };

  const amountRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const {navigate,} = useNavigation();
  const dispatch = useDispatch();
  const {ab} = useAuth();
  const getDefaultDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();

    const formattedMonth = month <= 9 ? `0${month}` : month;
    const formattedDate = date <= 9 ? `0${date}` : date;

    return `${year}-${formattedMonth}-${formattedDate}`;
  }

  const snapPoints = [50, 50, 50];
  const [showCalendar, setShowCalendar] = useState(false);
  const [categoryType, setCategoryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(getDefaultDate);
  const [subCategory, setSubCategory] = useState('');
  const [frequency, setFrequency] = useState(() => frequencyList[0]);
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector((state: RootState) => state.categories);
  const transactionTypes = useSelector((state: RootState) => state.transactionType);
  const transactionBasedCategories = categories.filter(category => category.transactionName == categoryType.transactionName);

  const handleNavigation = () => navigate('Account', {
    screen: 'accountEntry',
    params: {
      name: categoryType.transactionName, id: categoryType.id
    }
  });


  const handleAddTransaction = async () => {
    try {
      setIsLoading(true);
      const transactionToAdd = {
        transactionType: categoryType.id,
        amount: Number(amount),
        createdDate: transactionDate,
        categoryType: subCategory.categoryName,
        description,
        addedBy: ab?.username,
      };
      if (frequency.id == 'neverRepeat') {
        await insertTransactionForUser({
          ...transactionToAdd,
          isRecurringTransaction: '',
          dispatch
        });
        if (amount == '' || categoryType == '') {
          showWarningToast();
        } else {
          showSuccessToast();
        }
        navigate('History');
      } else if (frequency.id == 'monthly') {
        const date = new Date(transactionDate);
        date.setTime(date.getTime() + 955 * 60 * 1000);
        const currentMonth = date.getMonth();
        const currentDate = date.getDate();
        const currentYear = date.getFullYear();

        const formattedDate = currentDate <= 9 ? `0${currentDate}` : currentDate;

        const remainingMonthData = filterDataForDashboard
          .slice(currentMonth)
          .map((data) => {
            const formattedMonth = data.id < 9 ? `0${data.id + 1}` : data.id + 1;
            return ({
              ...transactionToAdd,
              isRecurringTransaction: frequency.id,
              createdDate: `${currentYear}-${formattedMonth}-${formattedDate}`
            })
          });
        let showWarning = false;
        for (const monthData of remainingMonthData) {
          await insertTransactionForUser({
            ...monthData,
            dispatch
          });
          if (!showWarning) {
            if (monthData.amount == '' || categoryType == '') {
              showWarning = true;
            }
          }

        }
        if (showWarning) {
          showWarningToast();
        } else {
          showSuccessToast();
        }
        navigate('History');
      }

      /*
      monthly -> get current month and subtract it from total month and loop
      quarterly -> 4 - current quarter and loop

      * */


    } catch (e) {
      showErrorToast();
      console.log(e, 'caught error here')
    } finally {
      setCategoryType('');
      setAmount('');
      setDescription('');
      setSubCategory('');
      setTransactionDate(getDefaultDate);
      setFrequency(frequencyList[0]);
      setIsLoading(false);
    }

  }
  return (
    <ScrollView>
      <YStack paddingHorizontal="$4">
        {!isLoading ? <>
          <Input
            marginVertical="$3"
            size="$6"
            placeholder="amount"
            keyboardType="numeric"
            returnKeyType="next"
            value={amount}
            onChangeText={setAmount}
            onSubmitEditing={() => descriptionRef?.current?.focus()}
            ref={amountRef}
          />
          <Input
            marginVertical="$2"
            size="$6"
            placeholder="description"
            keyboardType="default"
            returnKeyType="next"
            value={description}
            onChangeText={setDescription}
            ref={descriptionRef}
          />
          <DropDown
            items={transactionTypes}
            placeholder="Transaction Type"
            val={categoryType}
            setVal={setCategoryType}
            keyName='transactionName'

          />
          {categoryType !== '' && <DropDown
            items={categoryType !== '' ? transactionBasedCategories : categories}
            placeholder="Categories"
            val={subCategory}
            setVal={setSubCategory}
            keyName='categoryName'
            emptyItemOnPress={handleNavigation}
          />}
          <DropDown
            items={frequencyList}
            placeholder="Transaction Frequency for future transactions"
            val={frequency}
            keyName='name'
            setVal={setFrequency}
            defaultValue="Never Repeat"
          />
          <Button
            icon={() => <CalendarIcon stroke="purple"/>}
            size="$6"
            onPress={() => setShowCalendar((prevState) => !prevState)}
          >
            <Paragraph>{transactionDate}</Paragraph>
          </Button>
          <Sheet
            forceRemoveScrollEnabled={showCalendar}
            modal
            open={showCalendar}
            onOpenChange={setShowCalendar}
            snapPoints={snapPoints}
            snapPointsMode="percent"
            dismissOnSnapToBottom
            zIndex={100_000}
            animation="fast">
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{opacity: 0}}
              exitStyle={{opacity: 0}}
            />
            <Sheet.Frame>
              <Calendar
                style={{
                  marginVertical: 16,
                  borderRadius: 16,
                  paddingBottom: 8
                }}
                onDayPress={(day: DateData) => {
                  setTransactionDate(day.dateString);
                  setShowCalendar(false);
                }}
              />
            </Sheet.Frame>
          </Sheet>

          <Button
            size="$6"
            elevate
            marginVertical="$2"
            onPress={handleAddTransaction}
            icon={() => <Plus color="purple"/>}
          >
            Add
          </Button>
        </> : <YStack alignItems="center" marginVertical="$4">
          <Spinner size="large"/>
        </YStack>}
      </YStack>
    </ScrollView>
  );
}
