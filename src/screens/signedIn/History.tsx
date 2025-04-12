import {FlatList, SectionList} from "react-native";
import {useNavigation, useTheme,} from "@react-navigation/native";
import {Button, Card, H2, H3, H4, H5, Paragraph, ScrollView, Sheet, XStack, YStack,} from "tamagui";
import * as Haptics from 'expo-haptics';
import {ImpactFeedbackStyle} from 'expo-haptics';
import React, {useCallback, useEffect, useState} from "react";
import {useAuth, useDb} from "../../hooks";
import {TransactionLists} from "../../../schema";
import {and, desc, eq} from "drizzle-orm";
import {Filter} from "../../icons";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";


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
  const snapPoints = [70, 70, 70];
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeFilter, setActiveFilter] = useState(() => defaultCategory);
  const allCategories = useSelector((state: RootState) => state.categories);
  const transactionListByMonth = useSelector((state: RootState) => state.transactionList);
  const transactionType = useSelector((state: RootState) => state.transactionType)
  const filterForTransactionType = transactionType.map(type => ({
    ...type,
    isActive: false
  }));
  const allFilters = [defaultCategory, ...filterForTransactionType];
  // const flatListData = Object.values(transactionListByMonth).flatMap(transaction => transaction);
  const sectionData = Object
    .keys(transactionListByMonth)
    .reduce((acc, elm) => {
      const isElmPresent = acc.find(el => elm == el?.title)
      if (!isElmPresent) {
        const elementToAdd = {
          title: elm,
          data: activeFilter.transactionName == 'ALL' ? transactionListByMonth[elm] : transactionListByMonth[elm].filter(transaction => transaction.transactionTypeName == activeFilter.transactionName)
        };
        return acc.concat(elementToAdd);
      } else {

      }
      return acc;
    }, [])
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
          onPress={() => setShowCalendar((prevState) => !prevState)}
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
              borderRadius="$8"
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
            {filterDataForDashboard[title].name} {new Date().getFullYear()} {title}
          </H2>

          <XStack justifyContent="space-between">
            <YStack>
              {['  ', 'Transaction', 'Expense', 'Income', 'Transfer'].map(elm => <H5 key={elm}>{elm}</H5>)}
            </YStack>

            <YStack flex={0.8} alignItems="flex-start" justifyContent="flex-start">
              {['Total', data.length, calculateTotalExpense(data), calculateTotalIncome(data), calculateTotalTransfer(data)].map((elm, idx) =>
                <H5
                  key={`${elm}-${idx}`}
                  opacity={elm == 'Total' ? 0.6 : 1}
                  color={{0: theme.colors.text, 1: theme.colors.text, 2: '#ec0b0b', 3: '#0d7c02', 4: '#9b800c'}[idx]}
                >
                  {elm}
                </H5>)}
            </YStack>

          </XStack>

        </YStack>
        }
      />
      {/*{categories?.find(category => category.isActive === true)?.id !== 'all' && <XStack*/}
      {/*  marginTop="auto"*/}
      {/*  padding="$3"*/}
      {/*  margin="$2"*/}
      {/*  justifyContent="space-between"*/}
      {/*  borderRadius="$8"*/}
      {/*  borderWidth="$1"*/}
      {/*  borderColor="purple"*/}
      {/*>*/}
      {/*  <H5>{categories?.find(category => category.isActive === true)?.transactionName} Total</H5>*/}
      {/*  <H5>*/}
      {/*    {calculateTotal()}*/}
      {/*  </H5>*/}
      {/*</XStack>}*/}
      <Sheet
        forceRemoveScrollEnabled={showCalendar}
        modal
        open={showCalendar}
        onOpenChange={setShowCalendar}
        snapPoints={snapPoints}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="fast">
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{opacity: 0}}
          exitStyle={{opacity: 0}}
        />
        <Sheet.Frame paddingVertical="$4">
          <XStack justifyContent="center" alignItems="center">
            <H3>
              Filters
            </H3>
          </XStack>
          <ScrollView contentContainerStyle={{
            paddingBottom: 72
          }}>
            <YStack paddingLeft="$3">
              <H5>
                Categories
              </H5>
              <XStack justifyContent="space-evenly" alignItems="center" marginVertical="$2" flexWrap="wrap">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    marginVertical: 16,
                  }}
                >
                  {allCategories?.map((x) => (
                    <Button
                      key={x.categoryName}
                      margin="$2"
                      paddingHorizontal="$4"
                      elevate
                      bordered
                      borderRadius="$8"

                    >
                      {x?.categoryName}
                    </Button>
                  ))}
                </ScrollView>
              </XStack>
              <H5>
                Month
              </H5>
              <XStack justifyContent="space-evenly" alignItems="center" marginVertical="$2" flexWrap="wrap">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{

                  marginVertical: 16,
                }}>
                  {filterDataForDashboard.map((x) => (
                    <Button
                      key={x.name}
                      margin="$2"
                      paddingHorizontal="$4"
                      elevate
                      bordered
                      borderRadius="$6"
                    >
                      {x?.name}
                    </Button>
                  ))}
                </ScrollView>
              </XStack>
            </YStack>
          </ScrollView>
          <XStack
            marginVertical="$4"
            marginHorizontal="$4"
            justifyContent="space-between"
          >
            <Button
              themeInverse
              flex={0.4}
              onPress={() => setShowCalendar((prevState) => !prevState)}
            >
              Done
            </Button>

            <Button
              backgroundColor={theme.colors.background}
              flex={0.4}
              onPress={() => setShowCalendar((prevState) => !prevState)}
            >
              Clear
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}