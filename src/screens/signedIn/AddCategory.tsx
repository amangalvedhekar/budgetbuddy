import React, {useCallback, useId, useState} from "react";
import {Button, Card, Input, Label, RadioGroup, ScrollView, XStack, YStack} from "tamagui";
import {KeyboardAvoidingView} from "react-native";
import {useDb} from "../../hooks/useDb";
import {Categories as CategoriesSchema, Categories, TransactionTypes} from "../../../schema";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {DropDown} from "../../components/DropDown";

export const AddCategory = () => {

  const {db} = useDb();
  const {navigate} = useNavigation();
  const [categoryType, setCategoryType] = useState('');
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();
  const [categoryName, setCategoryName] = useState("");
  const addCategory = async () => {
    try {
      console.log(categoryType, 'on save')
      await db.insert(Categories).values({
        categoryName,
        transactionType: categoryType.id,
        id:  Math.floor(Math.random() * 9999).toString()
      });
      navigate('Categories')
    } catch (e) {
      console.log(JSON.stringify(e), 'what is it')
    }
  }
  useFocusEffect(useCallback(() => {
    (async () => {
      const def = await db.select({
        name: TransactionTypes.transactionName,
        id: TransactionTypes.id,
      }).from(TransactionTypes);
      setCategories(def);
    })();
  }, []))
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <KeyboardAvoidingView>
        <Card elevate
              padded
              borderRadius="$8"
              animation="bouncy"
              scale={0.5}
              marginVertical="$4"
              marginHorizontal="$2"
              hoverStyle={{scale: 0.925}}
              pressStyle={{scale: 0.875}}>
          <Input
            placeholder="Category Name"
            marginVertical="$3"
            size="$5"
            autoComplete="off"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          {/*<Label size="$6" marginLeft="$3">*/}
          {/*  Category Type:*/}
          {/*</Label>*/}
          {/*<RadioGroup value={categoryType} onValueChange={setCategoryType}>*/}
          {/*  <YStack width={300} alignItems="center">*/}
          {/*    <XStack width={300} alignItems="center">*/}
          {/*      <RadioGroup.Item value="1" size="$6">*/}
          {/*        <RadioGroup.Indicator/>*/}
          {/*      </RadioGroup.Item>*/}

          {/*      <Label size="$6" marginLeft="$3">*/}
          {/*        Expense*/}
          {/*      </Label>*/}
          {/*    </XStack>*/}
          {/*    <XStack width={300} alignItems="center">*/}
          {/*      <RadioGroup.Item value="0" size="$6">*/}
          {/*        <RadioGroup.Indicator/>*/}
          {/*      </RadioGroup.Item>*/}

          {/*      <Label size="$6" marginLeft="$3">*/}
          {/*        Income*/}
          {/*      </Label>*/}
          {/*    </XStack>*/}
          {/*  </YStack>*/}
          {/*</RadioGroup>*/}
          <DropDown items={categories} placeholder="Categories" val={categoryType} setVal={setCategoryType}/>
          <Button onPress={addCategory}>Add Category</Button>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}