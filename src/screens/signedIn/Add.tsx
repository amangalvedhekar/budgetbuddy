import {
  Button, H3, H4, H5,
  Input,
  Label, Paragraph,
  RadioGroup, ScrollView, Separator, useWindowDimensions,
  XStack,
  YStack
} from "tamagui";
import React, { useCallback, useRef, useState} from "react";
import { TextInput} from "react-native";
import {useFocusEffect, useNavigation, useRoute, } from "@react-navigation/native";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {useAuth, useDb} from "../../hooks";
import {Plus} from "../../icons";

import {Categories as CategoriesSchema} from "../../../schema";
import {DropDownContainer} from "../../components/DropDownContainer";
import {DropDown} from "../../components/DropDown";

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
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();
  const [transactionType, setTransactionType] = useState();

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
        categoryType: subCategory.name,
        description,
        addedBy: ab?.username,
      };
      await db.insert(TransactionLists).values(transactionToAdd);
    } catch (e) {
      console.log(e, 'caught error here')
    } finally {
      setIsTransactionBeingAdded(false);
      setCategoryType('');
      setAmount('');
      setDescription('');
      setSubCategory('')
      navigate('History');
    }

  }

  return (
    <>
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
      {categoryType !=='' && <DropDown
        items={categories}
        placeholder="Categories"
        val={subCategory}
        setVal={setSubCategory}
      />}
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
      </>
  );
}
