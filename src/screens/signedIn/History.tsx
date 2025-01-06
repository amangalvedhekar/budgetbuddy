import {FlatList, StyleSheet} from "react-native";
import {useFocusEffect, useNavigation,} from "@react-navigation/native";
import {Button, Card, H2, H3, H4, H5, Paragraph, ScrollView, XStack} from "tamagui";

import {useCallback, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {and, eq} from "drizzle-orm";
import {ChevronDown} from "../../icons";

// ToDo - Add types
const RenderItem = ({item, onPress}: any) => (
  <Card elevate
        margin="$2"
        padding="$2"
        size="$2"
        bordered
        borderRadius="$8"
        animation="bouncy"
        scale={0.9}
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}
        onPress={onPress}
  >

    <Card.Header>
      <XStack justifyContent="space-between" flex={1} flexWrap="wrap" paddingHorizontal="$2">
        <H3 size="$6" fontWeight="bold" textWrap="wrap" flexWrap="wrap" flex={0.9}>{item.description}</H3>
        <Paragraph size="$8" color={item.transactionType === '1' ? 'red' : 'green'}>{new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }).format(item.amount)}</Paragraph>
      </XStack>
    </Card.Header>
    <Card.Footer>
      <XStack justifyContent="space-between" flex={1} flexWrap="wrap" padding="$4">
        <H5>{item.categoryType}</H5>
        <H5>
          {item.transactionTypeName}
        </H5>
      </XStack>
    </Card.Footer>
  </Card>
);
const defaultCategory = {
  transactionName: 'ALL',
  isActive: true,
  id: 'all',
};
// yellow for investment and transfer transactions
export const History = () => {
  const [transactionList, setTransactionList] = useState<unknown>();
  const [categories, setCategories] = useState();
  const {db} = useDb();
  const {ab} = useAuth();
  const {navigate} = useNavigation();
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select().from(TransactionTypes);

      const def = await db.query.TransactionLists.findMany({
        where: and(
          eq(TransactionLists.addedBy, ab?.userId),
          eq(TransactionLists.isDeleted, false),
        )
      });
      const newData = def.map(d => {
        return ({
          ...d,
          transactionTypeName: abc?.find(x => x.id == d.transactionType)?.transactionName
        });
      });
      setTransactionList(newData);
      const categoriesList = await db
        .query.TransactionTypes
        .findMany({});
      const categoryWithDefault = [defaultCategory, ...categoriesList].map(l => (
        {
          ...l,
          isActive: l?.id == 'all',
        }
      ));
      setCategories(categoryWithDefault);

    })();
  }, []));
  const handleFilterPress = (a) => async (b) => {
    const indexFound = categories.findIndex(category => category.id == a.id);
    const newCategories = categories.map(category => {
      if (category.isActive) {
        return ({
          ...category,
          isActive: false,
        })
      } else {
        return category
      }
    });
    const newState = [
      ...newCategories?.slice(0, indexFound),
      {...a, isActive: true,},
      ...newCategories.slice(indexFound + 1),
    ];
    setCategories(newState);
    const def = await db.query.TransactionLists.findMany({
      where: and(
        eq(TransactionLists.addedBy, ab?.userId),
        eq(TransactionLists.isDeleted, false),
       a.id != 'all' ?  eq(TransactionLists.transactionType, a.id) : undefined,
      )
    });
    setTransactionList(def);

  }

  const calculateTotal = () => {
    const total = Array.isArray(transactionList) ? transactionList.reduce((acc,elm) => acc + Number(elm.amount), 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }

  return (
    <>
      <XStack justifyContent="space-evenly" marginVertical="$2" flexWrap="wrap">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories?.map((x) => (
            <Button
              key={x.transactionName}
              margin="$2"
              paddingHorizontal="$6"
              elevate
              bordered
              borderRadius="$8"
              onPress={handleFilterPress(x)}
              {...(x.isActive ? {backgroundColor: "purple"} : null)}
            >
              {x?.transactionName}
            </Button>
          ))}
        </ScrollView>
      </XStack>
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
        <Card.Header>
          <XStack justifyContent="space-between">
            <H5 textWrap="wrap">
              Description
              {/*<ChevronDown color="black"/>*/}
            </H5>

            <H5>
              Amount
              {/*<ChevronDown color="black"/>*/}
            </H5>
          </XStack>
        </Card.Header>
      </Card>
      <FlatList
        // @ts-expect-error
        data={transactionList}
        renderItem={({item}) => <RenderItem item={item} onPress={() => {

          navigate('historyEntryDetails', {entryId: item.id});
        }}/>
        }
      />
      {categories?.find(category => category.isActive === true)?.id !== 'all' && <XStack
        marginTop="auto"
        padding="$3"
        margin="$2"
        justifyContent="space-between"
        borderRadius="$4"
        borderWidth={StyleSheet.hairlineWidth}
        borderColor="purple"
      >
        <H5>Category Total</H5>
        <H5>
          {calculateTotal()}
        </H5>
      </XStack>}
    </>
  );
}