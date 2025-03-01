import {FlatList, StyleSheet} from "react-native";
import {useFocusEffect, useNavigation,} from "@react-navigation/native";
import {Button, Card, H3, H5, Paragraph, ScrollView, XStack, useTheme} from "tamagui";

import {useCallback, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {TransactionLists, TransactionTypes} from "../../../schema";
import {and, desc, eq} from "drizzle-orm";
import {ChevronDown} from "../../icons";
import {getTransactionForUser} from "../../dbOperations/transactionList";
const getColorForTransaction = (transactionType: number) => {
  const colorMap = {
    0: '#0d7c02',
    1: '#ec0b0b',
    2: '#ecbf0b',
    3: '#1bbe08',
    4: '#0857be'
  };
  return colorMap[transactionType];
}
// ToDo - Add types
// yellow for investment and transfer transactions
const RenderItem = ({item, onPress}: any) => {
  return (
    <Card elevate
          marginHorizontal="$2"
          marginVertical="$1"
          padding="$2"
          size="$1"
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
          <Paragraph size="$8" color={getColorForTransaction(item.transactionType)}>{new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
          }).format(item.amount)}</Paragraph>
        </XStack>
      </Card.Header>
      <Card.Footer>
        <XStack justifyContent="space-between" flex={1} flexWrap="wrap" padding="$2">
          <H5>{item.categoryType}</H5>
          <H5>
            {item.transactionTypeName}
          </H5>
          <H5>
            {item?.createdDate}
          </H5>
        </XStack>
      </Card.Footer>
    </Card>
  );
}


const defaultCategory = {
  transactionName: 'ALL',
  isActive: true,
  id: 'all',
};

export const History = () => {
  const [transactionList, setTransactionList] = useState<unknown>();
  const [categories, setCategories] = useState();
  const {db} = useDb();
  const {ab} = useAuth();
  const {navigate} = useNavigation();

  useFocusEffect(useCallback(() => {
    (async () => {
      const lol = await getTransactionForUser({userId: (ab?.userId as string)})
      setTransactionList(lol);
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
        a.id != 'all' ? eq(TransactionLists.transactionType, a.id) : undefined,
      ),
      orderBy: [desc(TransactionLists.createdDate)]
    });
    const newData = def.map(d => {
      return ({
        ...d,
        transactionTypeName: newState?.find(x => x.id == d.transactionType)?.transactionName
      });
    });
    setTransactionList(newData);

  }

  const calculateTotal = () => {
    const total = Array.isArray(transactionList) ? transactionList.reduce((acc, elm) => acc + Number(elm.amount), 0) : 0;
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
              paddingHorizontal="$4"
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
            </H5>

            <H5>
              Amount
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
        <H5>{categories?.find(category => category.isActive === true)?.transactionName} Total</H5>
        <H5>
          {calculateTotal()}
        </H5>
      </XStack>}
    </>
  );
}