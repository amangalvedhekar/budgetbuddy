import {Button, Card, H1, H4, Input, Label, Paragraph, Separator, XStack} from "tamagui";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useDb} from "../../hooks/useDb";
import {Categories as CategoriesSchema, TransactionLists, TransactionTypes} from "../../../schema";
import {eq} from "drizzle-orm";
import {DropDown} from "../../components/DropDown";


export const Details = () => {
  const {setOptions, canGoBack, goBack} = useNavigation();
  const {db} = useDb();
  const {params} = useRoute();
  const [transactionDetail, setTransactionDetail] = useState();
  const [subCategory, setSubCategory] = useState('');
  const [categories, setCategories] = useState<Array<{ name: string, transactionType: string }>>();
  const [transactionType, setTransactionType] = useState();
  const [categoryType, setCategoryType] = useState('');
  useFocusEffect(useCallback(() => {
    (async () => {
      const abcd = await db.select({
        name: CategoriesSchema.categoryName,
        transactionType: CategoriesSchema.transactionType,
      }).from(CategoriesSchema);

      setCategories(abcd);
      const defd = await db.select({
        name: TransactionTypes.transactionName,
        id: TransactionTypes.id,
      }).from(TransactionTypes);
      setTransactionType(defd);

      const abc = await db.select().from(TransactionLists).where(eq(TransactionLists.id, params?.entryId));

      setTransactionDetail(abc[0]);
      const currentTransactionType = defd.find(d => d.id == abc[0].transactionType);
      const currentCategoryType = abcd.find(b => b.name == abc[0].categoryType);
      setSubCategory(currentCategoryType);
      setCategoryType(currentTransactionType)
      setOptions({headerTitle: abc[0].description})
    })();
  }, [params]));

  const saveChanges = async () => {
    console.log('pressed', transactionDetail, categoryType, subCategory)
    const dataToSave = {
      ...transactionDetail,
      amount: Number(transactionDetail.amount),
      categoryType: subCategory.name,
      transactionType: categoryType.id,
      modifiedDate: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    };
    console.log(dataToSave, 'this will be pushed to db');
    await db.update(TransactionLists).set(dataToSave).where(eq(
      TransactionLists.id, params?.entryId
    ));
    if(canGoBack()){
      goBack();
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

    if(canGoBack()){
      goBack();
    }
  }

  return (
    <Card
      margin="$2"
      padding="$2"
      size="$2"
      bordered
      borderRadius="$8"
      animation="bouncy"
      scale={0.9}
      hoverStyle={{scale: 0.975}}
      pressStyle={{scale: 0.975}}
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
        />
      </XStack>

      <XStack margin="$3">
        <DropDown
          items={categories}
          placeholder="Categories"
          val={subCategory}
          setVal={setSubCategory}
        />
      </XStack>
      {/*<H4>*/}
      {/*  Date Added - {transactionDetail?.createdDate}*/}
      {/*</H4>*/}
      {/*<Separator/>*/}
      <Card.Footer>
        <XStack flex={1} flexWrap="wrap" justifyContent="space-between" padding="$2">
          <Button size="$6" onPress={deleteTransaction}>
            <Paragraph>
              Delete
            </Paragraph>
          </Button>
          <Button size="$6" onPress={saveChanges}>
            <Paragraph>
              Save Changes
            </Paragraph>
          </Button>
        </XStack>
      </Card.Footer>
    </Card>
  );
}