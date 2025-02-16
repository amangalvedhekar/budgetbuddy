import {Button, Card, H4, H5, ScrollView, Separator, XStack, H6} from "tamagui";
import { useNavigation} from "@react-navigation/native";
import { useEffect, useState} from "react";
import {SectionList} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {fetchCategories} from "../../dbOperations/categories";
import {CategoriesWithTransaction} from "../../features/categoriesSlice";

export const Categories = () => {
  const {navigate} = useNavigation();
  const [categories, setCategories] = useState();
  const dispatch = useDispatch();
  const categoriesWithTransactionType = useSelector((state: RootState)=> state.categories);
  useEffect(() => {
    (async () => {
      await fetchCategories(dispatch);
    })();
  }, [dispatch]);
  useEffect(() => {
    const initialValue: CategoriesWithTransaction[] = [];
    const sectionalData = categoriesWithTransactionType.reduce((acc, elm) => {

      const isPresent = acc?.find((e: CategoriesWithTransaction) => e?.transactionName == elm?.transactionName);

      if (isPresent) {
        const index = acc?.findIndex((e: CategoriesWithTransaction) => e?.transactionName == elm?.transactionName);
        const newDatas = {
          transactionName: acc[index].transactionName,
          transactionId: elm?.transactionType,
          data: [...acc[index].data, elm?.categoryName]
        };
        return [...acc?.slice(0, index), newDatas, ...acc?.slice(index + 1)]
      } else {
        const addData = {
          transactionName: elm?.transactionName,
          transactionId: elm?.transactionType,
          data: [elm?.categoryName],
        };
        return acc.concat(addData);
      }
    }, initialValue);
    setCategories(sectionalData);
  }, [categoriesWithTransactionType]);


  return (
    <>
      {Array.isArray(categories) && (
        <SectionList
          ListFooterComponent={() => <XStack margin="$3"/>}
          ListFooterComponentStyle={{
            margin: 32
          }}
          sections={categories}
          renderSectionHeader={({section: {transactionName}}) => (
              <H4 textAlign="center" marginVertical="$4">{transactionName}</H4>
          )}
          renderSectionFooter={({section: {transactionName, transactionId}}) => (
            <Button
              elevate
              bordered
              themeInverse
              size="$4"
              margin="$2"
              padding="$2"
              onPress={() =>
              {
                // @ts-ignore
                navigate('addCategory', {
                  name: transactionName, id: transactionId
                })}
              }

            >
              Add New{transactionName}Category
            </Button>
          )}
          SectionSeparatorComponent={() => <Separator />}
          renderItem={({item}) => (
            <Card
              elevate
              size="$2"
              margin="$2"
              bordered
              borderRadius="$8"
            >
              <Card.Header>
                <XStack flex={1} justifyContent="space-between">
                <H6 verticalAlign="center" alignSelf="center" paddingLeft="$2">
                  {item}
                </H6>
                  {/*<Button borderRadius="$10" marginRight="$3">*/}
                  {/*  667*/}
                  {/*</Button>*/}
                </XStack>
              </Card.Header>
            </Card>
          )}/>
      )}
    </>
  );
}