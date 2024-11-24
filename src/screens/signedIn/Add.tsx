import {
  Button,
  Card,
  H1,
  H4,
  Input,
  Label, Paragraph,
  RadioGroup,
  ScrollView,
  Separator,
  Text,
  useTheme,
  XStack,
  YStack
} from "tamagui";
import {ChevronDown, Cross, Plus} from "../../icons";
import React, {JSX, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {
  BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Keyboard, KeyboardAvoidingView, TextInput} from "react-native";
import {useTransactions} from "../../hooks";
import {Transaction} from "../../contexts/Transactions/types";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useSQLiteContext} from "expo-sqlite";
import {useDb} from "../../hooks/useDb";
import {TransactionLists} from "../../../schema";

const defaultInitialTransaction: Transaction = {
  description: '',
  amount: 0,
  type: 'Income',
  category: 'Pay Cheque'
}

export const Add = () => {
  const amountRef = useRef<TextInput>(null);
  const {navigate} = useNavigation();
  const {params} = useRoute();
  const {db} = useDb();
  const [categoryType, setCategoryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isTransactionReady, setIsTransactionReady] = useState(false);
  useEffect(() => {
    if(isTransactionReady) {
      (async () => {
        try {
          const x = await db.insert(TransactionLists).values({
            id:Math.floor(Math.random() * 9999).toString(),
            transactionType: categoryType,
            amount: Number(amount),
            categoryType: params?.selectedCategory,
            description,
          });
          console.log(x, 'did it wor')
        } catch (e) {
          console.log(JSON.stringify(e), 'error in adding')
        }
      })();
    }
  }, [isTransactionReady, params?.selectedCategory])
  return (
    <KeyboardAvoidingView>
      <YStack marginHorizontal="$2">
        <Input
          marginVertical="$2"
          size="$6"
          placeholder="description"
          value={description}
          onChangeText={setDescription}
          autoCapitalize="none"
          autoComplete="off"
          returnKeyType="done"
        />

        <Input
          marginVertical="$2"
          size="$6"
          placeholder="amount"
          keyboardType="numeric"
          returnKeyType="done"
          value={amount}
          onChangeText={setAmount}
          ref={amountRef}
        />
        <Label size="$6" marginLeft="$3">
          Category Type:
        </Label>
        <RadioGroup value={categoryType} onValueChange={setCategoryType} marginHorizontal="$2">
          <YStack width={300} alignItems="center">
            <XStack width={300} alignItems="center">
              <RadioGroup.Item value="1" size="$6">
                <RadioGroup.Indicator/>
              </RadioGroup.Item>

              <Label size="$6" marginLeft="$3">
                Expense
              </Label>
            </XStack>
            <XStack width={300} alignItems="center">
              <RadioGroup.Item value="0" size="$6">
                <RadioGroup.Indicator/>
              </RadioGroup.Item>

              <Label size="$6" marginLeft="$3">
                Income
              </Label>
            </XStack>
          </YStack>
        </RadioGroup>
        <Button onPress={() => navigate('Categories', {categoryType})}>
          {params?.selectedCategory ? params?.selectedCategory :"Select Category"}
        </Button>
        <Button onPress={() => setIsTransactionReady(true)} marginVertical="$4">Add transaction</Button>
      </YStack>
    </KeyboardAvoidingView>
  );
}