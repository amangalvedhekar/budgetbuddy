import {
  Button,
  Input,
  Paragraph,
  ScrollView,
  Sheet,
  YStack,
} from "tamagui";
import React, {useCallback, useRef, useState} from "react";
import {DeviceEventEmitter, TextInput} from "react-native";
import {useFocusEffect, useNavigation, useTheme} from "@react-navigation/native";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {useAuth, useDb} from "../../hooks";
import {CalendarIcon, Plus} from "../../icons";
import {Calendar} from "react-native-calendars";
import {Categories as CategoriesSchema} from "../../../schema";
import {DropDown} from "../../components/DropDown";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

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
  }
  const amountRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);
  const {navigate,} = useNavigation();
  const {db} = useDb();
  const {ab} = useAuth();

  const snapPoints = [50, 50, 50];
  const [showCalendar, setShowCalendar] = useState(false);
  const [categoryType, setCategoryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(() => `${new Date().getFullYear()}-0${new Date().getMonth() + 1}-${new Date().getDate()}`);
  const [subCategory, setSubCategory] = useState('');

  // const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();
  const categories = useSelector((state: RootState) => state.categories);
  const transactionTypes = useSelector((state: RootState) => state.transactionType);
  const transactionBasedCategories = categories.filter(category => category.transactionName == categoryType.transactionName);

  const handleNavigation = () => navigate('Account', {
    screen: 'accountEntry',
    params: {
      name: categoryType.transactionName, id: categoryType.id
    }
  })
  const handleAddTransaction = async () => {
    try {
      const transactionToAdd = {
        id: Math.floor(Math.random() * 9999).toString(),
        transactionType: categoryType.id,
        amount: Number(amount),
        createdDate: transactionDate,
        categoryType: subCategory.categoryName,
        description,
        addedBy: ab?.username,
      };
      await db.insert(TransactionLists).values(transactionToAdd);
      if (amount == '' || categoryType == '') {
        showWarningToast();
      } else {
        showSuccessToast();
      }
      navigate('History');
    } catch (e) {
      showErrorToast();
      console.log(e, 'caught error here')
    } finally {
      setCategoryType('');
      setAmount('');
      setDescription('');
      setSubCategory('');
      setTransactionDate(() => `${new Date().getFullYear()}-0${new Date().getMonth() + 1}-${new Date().getDate()}`);

    }

  }

  return (
    <ScrollView>
      <YStack paddingHorizontal="$4">
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
        {/*<DropDown*/}
        {/*  items={["Doesn't Repeat",'Weekly', 'Bi-Weekly', 'Monthly', 'Semi-Annually', 'Annually']}*/}
        {/*  placeholder="Transaction Frequency"*/}
        {/*  // val={}*/}
        {/*  setVal={console.log}*/}
        {/*  defaultValue="Doesn't Repeat"*/}
        {/*/>*/}
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

              onDayPress={day => {
                setTransactionDate(day.dateString);
                setShowCalendar(false);
              }}
              theme={{
                // backgroundColor: colors.primary,
                // calendarBackground: colors.primary,
                // textSectionTitleColor: colors.text,
                // selectedDayBackgroundColor: '#0d4dc5',
                // selectedDayTextColor: '#cf4f4f',
                // todayTextColor: colors.border,
                // dayTextColor: '#0d4dc5',
                // textDisabledColor: '#cf4f4f'
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

      </YStack>
    </ScrollView>
  );
}
