import {Button, Card, H1, H3, H4, H5, Input, Label, Paragraph, Separator, XStack} from "tamagui";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useDb} from "../../hooks/useDb";
import {Categories as CategoriesSchema, TransactionLists, TransactionTypes} from "../../../schema";
import {eq} from "drizzle-orm";
import {DropDown} from "../../components/DropDown";
import {DeviceEventEmitter} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


export const Details = () => {
  const {setOptions, canGoBack, goBack} = useNavigation();
  const {db} = useDb();
  const {params} = useRoute();
  const [transactionDetail, setTransactionDetail] = useState();
  const [subCategory, setSubCategory] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [formattedDate, setFormattedDate] = useState();
  const categories = useSelector((state: RootState) => state.categories);
  const transactionType = useSelector((state: RootState) => state.transactionType);
  const transactionList = useSelector((state: RootState) => state.transactionList);
  const transactionData = Object
    .values(transactionList)
    .flatMap(transaction => transaction)
    .find(data => data.id == params?.entryId)

  const showSuccessToastForUpdate = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Transaction updated successfully`,
      type: 'success',
    });
  };

  const showFailureToastForUpdate = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Something went wrong. Please try again later`,
      type: 'error',
    });
  };

  const showSuccessToastForDelete = () => {
    DeviceEventEmitter.emit("DISPLAY_TOAST", {
      message: `Transaction deleted successfully`,
      type: 'success',
    });
  };

  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select().from(TransactionLists).where(eq(TransactionLists.id, params?.entryId));
      const dateObject = new Date(abc[0]?.createdDate);
      const modified = dateObject.setTime(dateObject.getTime() + 955 * 60 * 1000);

      const formattedDate = new Intl.DateTimeFormat("en-CA", {
        dateStyle: 'long',
      }).format(modified);
      setTransactionDetail(abc[0]);
      const currentTransactionType = transactionType.find(d => d.id == abc[0].transactionType);
      const currentCategoryType = categories.find(b => b.categoryName == abc[0].categoryType);
      setSubCategory(currentCategoryType);
      setCategoryType(currentTransactionType);
      setFormattedDate(formattedDate);
      setOptions({headerTitle: abc[0].description});
    })();
  }, [params]));

  const saveChanges = async () => {
    const dataToSave = {
      ...transactionDetail,
      amount: Number(transactionDetail.amount),
      categoryType: subCategory.name,
      transactionType: categoryType.id,
      modifiedDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    };
    try {

      await db.update(TransactionLists).set(dataToSave).where(eq(
        TransactionLists.id, params?.entryId
      ));
      if (canGoBack()) {
        goBack();
      }
      showSuccessToastForUpdate();
    } catch (e) {
      showFailureToastForUpdate();
    }
  }

  const deleteTransaction = async () => {
    await db.update(TransactionLists).set({
      isDeleted: true,
      deletedDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    }).where(
      eq(
        TransactionLists.id,
        params?.entryId
      )
    );

    if (canGoBack()) {
      goBack();
    }
    showSuccessToastForDelete();
  }

  return (
    <Card
      margin="$2"
      padding="$2"
      size="$2"
      bordered
      borderRadius="$8"
    >
      <XStack justifyContent="space-between" margin="$3">
        <Label flex={0.3}>
          Description
        </Label>
        <Input
          value={transactionDetail?.description}
          onChangeText={(text) => setTransactionDetail((prevState) => ({
            ...prevState,
            description: text,
          }))}
          flex={0.7}
        />
      </XStack>

      <XStack justifyContent="space-between" margin="$3">
        <Label flex={0.3}>
          Amount
        </Label>
        <Input
          value={transactionDetail?.amount?.toString()}
          onChangeText={(text) => setTransactionDetail((prevState) => ({
            ...prevState,
            amount: text,
          }))}
          flex={0.7}
        />
      </XStack>

      <XStack margin="$3">
        <DropDown
          items={transactionType}
          placeholder="Transaction Type"
          val={categoryType}
          setVal={setCategoryType}
          keyName="transactionName"
        />
      </XStack>

      <XStack margin="$3">
        <DropDown
          items={categories}
          placeholder="Categories"
          val={subCategory}
          setVal={setSubCategory}
          keyName="categoryName"
        />
      </XStack>
      <XStack justifyContent="space-between" margin="$3">
        <Label flex={0.4}>
          Created Date:
        </Label>
        <H4>
          {formattedDate}
        </H4>
      </XStack>

      <Separator/>
      <Card.Footer>
        <XStack flex={1} flexWrap="wrap" justifyContent="space-between" padding="$2">
          <Button
            onPress={deleteTransaction}
            backgroundColor="#ec0b0b"
            size="$4"
          >
            Delete
          </Button>
          <Button
            onPress={saveChanges}
            themeInverse
            size="$4"
          >
            Save Changes
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
}