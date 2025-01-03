import {FlatList} from "react-native";
import {useFocusEffect, useNavigation,} from "@react-navigation/native";
import {Button, Card, H2, H3, H4, H5, Paragraph, ScrollView, XStack} from "tamagui";

import { useCallback, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {and, eq} from "drizzle-orm";

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
export const History = () => {
  const [transactionList, setTransactionList] = useState<unknown>();
  const {db} = useDb();
  const {ab} = useAuth();
  const {navigate} = useNavigation();
  useFocusEffect(useCallback(() => {
    (async () => {
      const abc = await db.select().from(TransactionTypes);
      const def = await db.query.TransactionLists.findMany({
        where: and(
          eq(TransactionLists.addedBy, ab?.userId),
          eq(TransactionLists.isDeleted, false)
        )
      })
      const newData = def.map(d => {
        return ({
          ...d,
          transactionTypeName: abc?.find(x => x.id == d.transactionType)?.transactionName
        });
      });
      setTransactionList(newData);
    })();
  }, []));
  return (
    <>
      {/*<XStack justifyContent="space-evenly" marginVertical="$2" flexWrap="wrap">*/}
      {/*  <ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
      {/*{['EXPENSE', 'INCOME', 'INVESTMENT', 'dd', 'ee'].map(x => (*/}
      {/*  <Button key={x} margin="$1">*/}
      {/*    {x}*/}
      {/*  </Button>*/}
      {/*))}*/}
      {/*  </ScrollView>*/}
      {/*</XStack>*/}
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
            </H5>
            <H5>Amount</H5>
          </XStack>
        </Card.Header>
      </Card>
      <FlatList
        // @ts-expect-error
        data={transactionList}
        renderItem={({item}) => <RenderItem item={item} onPress={() => {

          navigate('historyEntryDetails',{entryId: item.id});
        }}/>}
      />

    </>
  );
}