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

export const Add = () => {
  const amountRef = useRef<TextInput>(null);
  const {navigate,} = useNavigation();
  const {colors} = useTheme();
  const {db} = useDb();
  const {ab} = useAuth();

  const [showCalendar, setShowCalendar] = useState(false);
  const [categoryType, setCategoryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(`${new Date().getFullYear()}-0${new Date().getMonth() + 1}-${new Date().getDate()}`);
  const [isTransactionBeingAdded, setIsTransactionBeingAdded] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();
  const [transactionType, setTransactionType] = useState();
  const snapPoints = [50, 50, 50];
  const showSuccessToast = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", `Transaction added successfully`);
  };
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select({
        name: CategoriesSchema.categoryName,
        transactionType: CategoriesSchema.transactionType,
      }).from(CategoriesSchema);

      setCategories(abc);
      const def = await db.select({
        name: TransactionTypes.transactionName,
        id: TransactionTypes.id,
      }).from(TransactionTypes);
      setTransactionType(def);

    })();
  }, []));
  const handleAddTransaction = async () => {
    try {
      setIsTransactionBeingAdded(true);
      const transactionToAdd = {
        id: Math.floor(Math.random() * 9999).toString(),
        transactionType: categoryType.id,
        amount: Number(amount),
        createdDate: transactionDate,
        categoryType: subCategory.name,
        description,
        addedBy: ab?.username,
      };
      await db.insert(TransactionLists).values(transactionToAdd);
      showSuccessToast();
    } catch (e) {
      console.log(e, 'caught error here')
    } finally {
      setIsTransactionBeingAdded(false);
      setCategoryType('');
      setAmount('');
      setDescription('');
      setSubCategory('');
      setTransactionDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`);
      navigate('History');
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
          ref={amountRef}
        />
        <DropDown
          items={transactionType}
          placeholder="Transaction Type"
          val={categoryType}
          setVal={setCategoryType}
        />
        {categoryType !== '' && <DropDown
          items={categories}
          placeholder="Categories"
          val={subCategory}
          setVal={setSubCategory}
        />}
        <Button
          icon={() => <CalendarIcon stroke="purple"/>}
          size="$6"
          onPress={() => setShowCalendar((prevState) => !prevState)}
        >
          <Paragraph>{transactionDate}</Paragraph>
        </Button>
        <Sheet
          forceRemoveScrollEnabled={showCalendar}
          modal={true}
          open={showCalendar}
          onOpenChange={setShowCalendar}
          snapPoints={snapPoints}
          snapPointsMode="percent"
          dismissOnSnapToBottom
          zIndex={100_000}
          animation="medium">
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
