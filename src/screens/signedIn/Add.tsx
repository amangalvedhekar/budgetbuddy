import {
  Button,
  Card,
  H1,
  H4,
  Input,
  Label,
  RadioGroup,
  ScrollView,
  Separator,
  Text,
  useTheme,
  XStack,
  YStack
} from "tamagui";
import {ChevronDown, Cross, Plus} from "../../icons";
import {JSX, useCallback, useMemo, useRef, useState} from "react";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {
  BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Keyboard, KeyboardAvoidingView, TextInput} from "react-native";
import {useTransactions} from "../../hooks";
import {Transaction} from "../../contexts/Transactions/types";
import {useFocusEffect} from "@react-navigation/native";

const defaultInitialTransaction: Transaction = {
  description: '',
  amount: 0,
  type: 'Income',
  category: 'Pay Cheque'
}

const income = ['Dividend', 'Bonus', 'Pay Cheque'];
const expense = ['Grocery', 'Internet', 'Rent', 'Uber', 'DoorDash', 'Medicines', 'Insurance', 'Subscriptions', 'Others', 'Grooming', 'Restaurant'];
export const Add = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const anotherSheet = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['45%', '45%'], []);
  const anotherSnapPoints = useMemo(() => ['65%', '65%'], []);

  // callbacks
  const handlePresentModalPress = useCallback((e: any | undefined) => {
    setTransaction((prev) => ({...prev, amount: e?.nativeEvent?.text}))
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  const {add} = useTransactions();
  const [showBanner, setShowBanner] = useState(false);
  const [transaction, setTransaction] = useState<Transaction>(defaultInitialTransaction);

  const amountRef = useRef<TextInput>(null);
  useFocusEffect(useCallback(() => {
    setShowBanner(false);
  }, []));
  return (
    <KeyboardAvoidingView>
      {showBanner ? <Card
        elevate
        margin="$2"
        borderRadius="$8"
        animation="bouncy"
        scale={0.9}
        size="$2"
        backgroundColor="green"
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}>
        <Card.Header>
          <H4 size="$7" fontWeight="bold" textAlign="center">
            Transaction Added Successfully
          </H4>
        </Card.Header>
      </Card> : <></>}
      <YStack>
        <Input
          margin="$2"
          size="$6"
          placeholder="description"
          autoCapitalize="none"
          autoComplete="off"
          returnKeyType="done"
          onSubmitEditing={(e) => {
            setTransaction((prev) => ({...prev, description: e.nativeEvent.text}))
            amountRef?.current?.focus();
          }}
        />

        <Input
          margin="$2"
          size="$6"
          placeholder="amount"
          keyboardType="numeric"
          returnKeyType="done"
          ref={amountRef}
          onSubmitEditing={handlePresentModalPress}
        />

        <Button
          borderRadius="$8"
          size="$6"
          margin="$2"
          iconAfter={() => <ChevronDown color={useTheme().color?.get()}/>}
          onPress={() => {
            Keyboard.dismiss();
            bottomSheetModalRef.current?.present();
          }}
        >
          {transaction.type}
        </Button>
        <Button
          borderRadius="$8"
          size="$6"
          margin="$2"
          iconAfter={() => <ChevronDown color={useTheme().color?.get()}/>}
          onPress={() => {
            Keyboard.dismiss();
            bottomSheetModalRef.current?.present();
          }}
        >
         {transaction.category}
        </Button>
        <Button
          borderRadius="$8"
          size="$6"
          margin="$2"
          icon={() => <Plus color={useTheme().color?.get()}/>}
          onPress={() => {

            add(transaction);
            setShowBanner(true);

          }}
        >
          Add Transaction
        </Button>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          backdropComponent={renderBackdrop}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{backgroundColor: useTheme()?.background?.get()}}>
          <XStack justifyContent="center">
            <H4>
              Transaction Type
            </H4>
          </XStack>
          <RadioGroup
            defaultValue="Expense"
            value={transaction.type}
            onPress={() => {
              bottomSheetModalRef?.current?.dismiss();
            }}

          >
            <XStack alignItems="center" margin="$2">
              <RadioGroup.Item value="Expense" size="$6" margin="$2" onPress={() => {
                bottomSheetModalRef?.current?.dismiss();
                setTransaction((prev) => ({...prev, type: 'Expense'}));
                anotherSheet?.current?.present('Expense');
              }}>
                <RadioGroup.Indicator/>
              </RadioGroup.Item>
              <Label size="$6">
                Expense
              </Label>
            </XStack>
            <Separator/>
            <XStack alignItems="center" margin="$2">
              <RadioGroup.Item value="Income" size="$6" margin="$2" onPress={() => {
                bottomSheetModalRef?.current?.dismiss();
                setTransaction((prev) => ({...prev, type: 'Income'}));
                anotherSheet?.current?.present('Income');
              }}>
                <RadioGroup.Indicator/>
              </RadioGroup.Item>
              <Label size="$6">
                Income
              </Label>
            </XStack>
          </RadioGroup>
        </BottomSheetModal>
        <BottomSheetModal
          ref={anotherSheet}
          index={1}
          backdropComponent={renderBackdrop}
          snapPoints={anotherSnapPoints}
          backgroundStyle={{backgroundColor: useTheme()?.background?.get()}}>

          {(data) =>
            <BottomSheetScrollView>
              <XStack justifyContent="center">
                <H4>
                  {data?.data} - Categories
                </H4>
              </XStack>
              <RadioGroup
                value={transaction.category}
                onPress={() => {
                  anotherSheet?.current?.dismiss();
                }}

              >
                {
                  [...(data?.data === 'Income' ? income : expense)].map(item => (
                    <XStack alignItems="center" margin="$2" key={item}>
                      <RadioGroup.Item value={item} size="$6" margin="$2" onPress={() => {
                        bottomSheetModalRef?.current?.dismiss();
                        setTransaction((prev) => ({...prev, category: item}));
                        anotherSheet?.current?.close();
                      }}
                      >
                        <RadioGroup.Indicator/>
                      </RadioGroup.Item>
                      <Label size="$6">
                        {item}
                      </Label>
                    </XStack>))
                }
              </RadioGroup>
            </BottomSheetScrollView>
          }
        </BottomSheetModal>
      </YStack>
    </KeyboardAvoidingView>
  );
}