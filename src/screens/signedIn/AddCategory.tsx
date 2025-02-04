import React, {useCallback, useEffect, useId, useState} from "react";
import {Button, Card, Input, Label, RadioGroup, ScrollView, XStack, YStack} from "tamagui";
import {KeyboardAvoidingView} from "react-native";
import {Categories as CategoriesSchema, Categories, TransactionTypes} from "../../../schema";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {DropDown} from "../../components/DropDown";
import {useDispatch, useSelector} from "react-redux";
import {addCategory} from "../../dbOperations/categories";

import {RootState} from "../../store";
import {fetchTransactionType} from "../../dbOperations/transactionType";

export const AddCategory = () => {
  const {navigate} = useNavigation();
  const {params} = useRoute();
  const [transactionName, setTransactionName] = useState<string>(() => params.name);
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      await fetchTransactionType(dispatch)
    })();
  }, [dispatch]);
  const categories = useSelector((state: RootState) => state.categories);
  const transactionTypes = useSelector((state: RootState) => state.transactionType)

  const handleAddCategory = async () => {
    try {
      await addCategory({
        categoryName,
       transactionName,
      }, dispatch);
      setCategoryName('');
      setTransactionName('');
      navigate('Categories');
    } catch (e) {
      console.log(JSON.stringify(e), 'what is it')
    }
  }

  const getTransactionTypes = () => transactionTypes.reduce((acc, elm) => [...acc, elm.transactionName], []);
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <KeyboardAvoidingView>
        <Card
          elevate
          padded
          borderRadius="$8"
          animation="bouncy"
          scale={0.5}
          marginVertical="$4"
          marginHorizontal="$2"
          hoverStyle={{scale: 0.925}}
          pressStyle={{scale: 0.875}}
        >
          <Input
            placeholder="Category Name"
            marginVertical="$3"
            size="$5"
            autoComplete="off"
            value={categoryName}
            onChangeText={setCategoryName}
          />
          {Array.isArray(categories) && <DropDown
            items={getTransactionTypes()}
            placeholder="Categories"
            val={transactionName}
            setVal={setTransactionName}
          />}
          <Button
            onPress={handleAddCategory}
          >
            Add Category
          </Button>
        </Card>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}