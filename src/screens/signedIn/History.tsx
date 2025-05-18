import {SectionList} from "react-native";
import {useNavigation, useTheme,} from "@react-navigation/native";
import {Button, Card, H2, H3, H4, H5, Paragraph, ScrollView, Sheet, XStack, YStack,} from "tamagui";
import * as Haptics from 'expo-haptics';
import {ImpactFeedbackStyle} from 'expo-haptics';
import React, {useEffect, useState} from "react";

import {ChevronRight, Filter} from "../../icons";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../store";
import {resetFilters} from "../../features/transactionFilterSlice";


const getColorForTransaction = (transactionType: number) => {
  const colorMap: Record<number, string> = {
    0: '#0d7c02',
    1: '#ec0b0b',
    2: '#9b800c',
    3: '#0d7c02',
    4: '#ecbf0b'
  };
  return colorMap[transactionType];
}
// ToDo - Add types
const RenderItem = ({item, onPress}: any) => {
  const dateObject = new Date(item?.createdDate);
  const modified = dateObject.setTime(dateObject.getTime() + 955 * 60 * 1000);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    dateStyle: 'long',
  }).format(modified);
  return (
    <Card
      elevate
      marginHorizontal="$2"
      marginVertical="$2"
      padding="$2"
      size="$1"
      bordered
      borderRadius="$8"

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
            {formattedDate}
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
  const currentDate = new Date();
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth() + 1;
  const [activeFilter, setActiveFilter] = useState(() => defaultCategory);

  const transactionListByYear = useSelector((state: RootState) => state.transactionList);
  const dispatch = useDispatch();
  const {colors} = useTheme();
  const transactionListByMonth = transactionListByYear[currentYear] ?? {};
  const transactionType = useSelector((state: RootState) => state.transactionType);
  const {selectedMonth, selectedCategory} = useSelector((state: RootState) => state.transactionFilter);

  const filterForTransactionType = transactionType.map(type => ({
    ...type,
    isActive: false
  }));

  const allFilters = [defaultCategory, ...filterForTransactionType];
  // const flatListData = Object.values(transactionListByMonth).flatMap(transaction => transaction);
  const sectionData = Object
    .keys(transactionListByMonth)
    .reduce((acc, elm) => {
      const isElmPresent = acc.find(el => elm == el?.title);
      const filterPredicate = selectedCategory.length > 0
        ? transaction => activeFilter.transactionName !== 'ALL'
          ? transaction.transactionTypeName == activeFilter.transactionName && selectedCategory.some(cate => cate == transaction.categoryType)
          : selectedCategory.some(cate => cate == transaction.categoryType)
        : transaction => transaction.transactionTypeName == activeFilter.transactionName

      if (!isElmPresent) {
        const elementToAdd = {
          title: elm,
          data: activeFilter.transactionName == 'ALL' && selectedCategory.length == 0 ?
            transactionListByMonth[elm] :
            transactionListByMonth[elm]
              .filter(filterPredicate)
        };
        return acc.concat(elementToAdd);
      }
      return acc;
    }, [])
    .filter(data => selectedMonth.length > 0 ? selectedMonth.some(month => month.id == data.title) : data)
    .slice(0, currentMonth)
    .reverse();

  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <XStack marginHorizontal="$3">
        <Filter
          fill="purple"
          height={40}
          width={40}
          onPress={() => navigation.navigate('filter')}
        />
      </XStack>
    })
  }, [navigation]);


  const calculateTotalExpense = (data) => {
    const total = Array.isArray(data) ? data.reduce((acc, elm) => elm.transactionTypeName == 'Expense' ? acc + Number(elm.amount) : acc, 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }

  const calculateTotalIncome = (data) => {
    const total = Array.isArray(data) ? data.reduce((acc, elm) => elm.transactionTypeName == 'Income' ? acc + Number(elm.amount) : acc, 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }

  const calculateTotalTransfer = (data) => {
    const total = Array.isArray(data) ? data.reduce((acc, elm) => elm.transactionTypeName == 'Transfer' ? acc + Number(elm.amount) : acc, 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }

  const calculateTotalInvestment = (data) => {
    const total = Array.isArray(data) ? data.reduce((acc, elm) => elm.transactionTypeName == 'Investment' ? acc + Number(elm.amount) : acc, 0) : 0;
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(total);
  }

  return (
    <>
      <XStack justifyContent="space-evenly" alignItems="center" marginVertical="$1" flexWrap="wrap">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginVertical: 8,
          }}
        >
          {allFilters?.map((x) => (
            <Button
              key={x.transactionName}
              margin="$2"
              paddingHorizontal="$4"
              elevate
              bordered
              borderRadius="$6"
              onPress={() => {
                setActiveFilter({
                  ...x,
                });

              }}
              {...(x.transactionName == activeFilter.transactionName ? {backgroundColor: "purple"} : null)}
            >
              {x?.transactionName}
            </Button>
          ))}
        </ScrollView>

      </XStack>
      <YStack marginVertical="$2" marginHorizontal="$2">
        <Card onPress={() => navigation.navigate('Account', {
          screen: 'accountEntry',
          params: {
            screen: 'recurringTransaction'
          }
        })}>
          <Card.Header>
            <XStack justifyContent="space-between" alignItems="center">
              <H5>
                See recurring transactions
              </H5>
              <ChevronRight color={colors.text}/>
            </XStack>
          </Card.Header>
        </Card>
      </YStack>
      {/* <FlatList*/}
      {/*  data={flatListData}*/}
      {/*  renderItem={({item}) => <RenderItem*/}
      {/*    item={item}*/}
      {/*    onPress={async () => {*/}
      {/*      await Haptics.impactAsync(ImpactFeedbackStyle.Medium);*/}
      {/*      navigation.navigate('historyEntryDetails', {entryId: item.id});*/}
      {/*    }}/>*/}
      {/*  }*/}
      {/*/>*/}
      {(selectedCategory.length > 0 || selectedMonth.length > 0) && <YStack marginVertical="$2" marginHorizontal="$2">
        <Card onPress={() => dispatch(resetFilters())}>
          <Card.Header>
            <XStack justifyContent="space-between" alignItems="center">
              <H5>
                Filters Applied! Tap to remove
              </H5>
            </XStack>
          </Card.Header>
        </Card>
      </YStack>}
      <SectionList
        sections={sectionData}
        renderItem={({item}) => <RenderItem item={item} onPress={async () => {
          await Haptics.impactAsync(ImpactFeedbackStyle.Medium);
          navigation.navigate('historyEntryDetails', {entryId: item.id});
        }}/>}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({section: {title, data}}) => <YStack marginVertical="$3" marginHorizontal="$2"
                                                                   padding="$2">
          <H2>
            {filterDataForDashboard[title].name} {' '} {data[0]?.createdDate.split('-')[0]}
          </H2>

          <XStack justifyContent="space-between">
            <YStack>
              {['  ', 'Transaction', 'Expense', 'Income', 'Transfer', 'Investment'].map(elm => <H5
                key={elm}>{elm}</H5>)}
            </YStack>

            <YStack flex={0.8} alignItems="flex-start" justifyContent="flex-start">
              {['Total', data.length, calculateTotalExpense(data), calculateTotalIncome(data), calculateTotalTransfer(data), calculateTotalInvestment(data)].map((elm, idx) =>
                <H5
                  key={`${elm}-${idx}`}
                  opacity={elm == 'Total' ? 0.6 : 1}
                  color={{
                    0: theme.colors.text,
                    1: theme.colors.text,
                    2: '#ec0b0b',
                    3: '#0d7c02',
                    4: '#9b800c',
                    5: '#0d7c02'
                  }[idx]}
                >
                  {elm}
                </H5>)}
            </YStack>

          </XStack>

        </YStack>
        }
      />
    </>
  );
}