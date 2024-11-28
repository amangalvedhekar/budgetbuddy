import {
  Button,
  Input,
  Label,
  RadioGroup,
  XStack,
  YStack
} from "tamagui";
import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, KeyboardAvoidingView, TextInput} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useDb} from "../../hooks/useDb";
import {TransactionLists} from "../../../schema";


export const Add = () => {
  const amountRef = useRef<TextInput>(null);
  const {navigate, setParams} = useNavigation();
  const {params} = useRoute();
  const {db} = useDb();
  const [categoryType, setCategoryType] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isTransactionBeingAdded, setIsTransactionBeingAdded] = useState(false);
  const [subCategory, setSubCategory] = useState('Select Category');

  const handleAddTransaction = async () => {
    try {
      setIsTransactionBeingAdded(true);
      const transactionToAdd = {
        id: Math.floor(Math.random() * 9999).toString(),
        transactionType: categoryType,
        amount: Number(amount),
        categoryType: params?.selectedCategory,
        description,
      };
      await db.insert(TransactionLists).values(transactionToAdd);
      console.log(transactionToAdd, 'is this goo')
    } catch (e) {
      console.log(e, 'caught error here')
    } finally {
      setIsTransactionBeingAdded(false);
      setCategoryType('');
      setAmount('');
      setDescription('');
      setSubCategory('Select Category')
      navigate('History');
    }

  }

useEffect(() => {
  if(params?.selectedCategory != '') {
    setSubCategory(params?.selectedCategory);
  }
},[params?.selectedCategory]);
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
          {subCategory}
        </Button>
        <Button onPress={handleAddTransaction} marginVertical="$4" disabled={isTransactionBeingAdded}>
          {isTransactionBeingAdded ? <ActivityIndicator/> : 'Add transaction'}
        </Button>
      </YStack>
    </KeyboardAvoidingView>
  );
}