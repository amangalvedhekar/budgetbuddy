import {
  Button, H3, H5,
  Input,
  Label,
  RadioGroup,
  XStack,
  YStack
} from "tamagui";
import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, KeyboardAvoidingView, TextInput} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {TransactionLists} from "../../../schema";
import {useAuth, useDb} from "../../hooks";

// use row based instead of column based design
//

export const Add = () => {
  const amountRef = useRef<TextInput>(null);
  const {navigate,} = useNavigation();
  const {params} = useRoute();
  const {db} = useDb();
  const {ab} = useAuth();
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
        addedBy: ab?.username,
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
      <XStack marginHorizontal="$2" justifyContent="space-between">
        <Label>Amount</Label>
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
      </XStack>
      <XStack marginHorizontal="$2" justifyContent="space-between">
        <Label>Description</Label>
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
      </XStack>
      <XStack marginHorizontal="$2" >

        <RadioGroup value={categoryType} onValueChange={setCategoryType} marginHorizontal="$2">
          <XStack alignItems="center" justifyContent="space-evenly">
            <XStack alignItems="center">
              <RadioGroup.Item value="1" size="$6" >
                <RadioGroup.Indicator/>
              </RadioGroup.Item>

              <Label size="$6" marginLeft="$3" >
                Expense
              </Label>
            </XStack>
            <XStack alignItems="center">
              <RadioGroup.Item value="0" size="$6">
                <RadioGroup.Indicator/>
              </RadioGroup.Item>

              <Label size="$6" marginRight="$3">
                Income
              </Label>
            </XStack>
            <XStack alignItems="center">
              <RadioGroup.Item value="2" size="$6">
                <RadioGroup.Indicator/>
              </RadioGroup.Item>

              <Label size="$6" marginLeft="$3">
                Transfer
              </Label>
            </XStack>
          </XStack>
        </RadioGroup>
      </XStack>
        <Button onPress={() => navigate('Categories', {categoryType})}>
          {subCategory}
        </Button>
        <Button onPress={handleAddTransaction} marginVertical="$4" disabled={isTransactionBeingAdded} size="$6">
          {isTransactionBeingAdded ? <ActivityIndicator/> : <H3>Save</H3>}
        </Button>

    </KeyboardAvoidingView>
  );
}