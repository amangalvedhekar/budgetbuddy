import React, {useRef, useState} from 'react';
import {Check, Cross} from "../../icons";
import {
  Card,
  Circle,
  H1, H3,
  H4,
  H5,
  Paragraph,
  ScrollView,
  Separator,
  useWindowDimensions,
  XStack,
  YStack
} from "tamagui";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {BarChart} from "react-native-gifted-charts";
import {useNavigation, useScrollToTop, useTheme} from "@react-navigation/native";
import {StyleSheet} from "react-native";
import {setSelectedCategory, setSelectedMonth} from "../../features/transactionFilterSlice";

export const Insight = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const transactionLists = useSelector((state: RootState) => state.transactionList);
  const actualTransactions = transactionLists[currentYear] ?? {};
  const categories = useSelector((state: RootState) => state.categories);
  const categoriesForExpense = categories.filter(elm => elm.transactionName == 'Expense');
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState([]);
  const {navigate} = useNavigation();
  const [coordinatesForExpense, setCoordinatesForExpense] = useState([]);
  const scrollRef = useRef();
  const scrollViewRef = useRef<ScrollView>();
  const budgetedVsActualScrollRef = useRef();
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  useScrollToTop(scrollViewRef);
  const closerStackData = filterDataForDashboard.map(data => ({
    label: data.name,
    stacks: [
      {value: expectedIncome[data.id].reduce((acc, elm) => acc + Number(elm.value), 0), color: 'green'},
      {value: budgetedExpense[data.id].reduce((acc, elm) => acc + Number(elm.value), 0), color: 'red'}
    ],
  }));

  const budgetedAndExpectedIncome = filterDataForDashboard.flatMap(data => {
    const budgetedData = {
      value: budgetedExpense[data.id].reduce((acc, elm) => acc + Number(elm.value), 0),
      label: data.name,
      spacing: 1,
      frontColor: 'red'
    };
    const expectIncome = {
      value: expectedIncome[data.id].reduce((acc, elm) => acc + Number(elm.value), 0), frontColor: 'green',
      data,
    };
    return [
      {...budgetedData},
      {...expectIncome}
    ];
  })

  const closerBarData = filterDataForDashboard.flatMap(data => {
    const budgetedData = {
      value: budgetedExpense[data.id].reduce((acc, elm) => acc + Number(elm.value), 0),
      label: data.name,
      spacing: 1,

    };
    const actualData = {
      value: (data?.id in actualTransactions) ? actualTransactions[data.id].reduce((acc, elm) => elm.transactionTypeName == 'Expense' ? acc + Number(elm.amount) : acc, 0) : 0,
      frontColor: '#3251c7',
      data
    };
    return [
      {...budgetedData},
      {...actualData}
    ]
  });


  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 72}}
      ref={scrollViewRef}
    >
      <H4 marginHorizontal="$4" marginVertical="$2">
        Budgeted Expense & Expected Income
      </H4>
      <XStack alignItems="center" marginHorizontal="$4" marginVertical="$4">
        <H5>
          Legend:
        </H5>
        <XStack alignItems="center">
          <Circle size="$1" backgroundColor="red" marginHorizontal="$3"/>
          <Paragraph>
            Budgeted Expense
          </Paragraph>
        </XStack>
        <XStack alignItems="center">
          <Circle size="$1" backgroundColor="green" marginHorizontal="$3"/>
          <Paragraph>
            Expected Income
          </Paragraph>
        </XStack>
      </XStack>
      <XStack
        flex={1}
        justifyContent="center"
        marginVertical="$3"
      >
        <BarChart
          noOfSections={4}
          isAnimated
          data={budgetedAndExpectedIncome}
          frontColor={colors.text}
          yAxisTextStyle={{
            color: colors.text
          }}
          barWidth={48}
          xAxisLabelTextStyle={{
            color: colors.text,
          }}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisLabelWidth={64}
          onPress={(_, idx) => {
            scrollRef?.current?.scrollTo({x: coordinates[filterDataForDashboard[Math.floor(idx / 2)].id]})
            console.log('on press', idx);
          }}
          autoCenterTooltip
          renderTooltip={(item) => <Paragraph
            color={item?.frontColor}
            marginLeft="$2"
            marginTop="$2"
            paddingTop="$2"
          >{new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
          }).format(item.value)}</Paragraph>}
        />
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        ref={scrollRef}
      >
        {filterDataForDashboard.map((i, idx) => (
            <XStack
              key={i.id}
              flex={1}
              marginVertical="$4"
              onLayout={e => {
                const layout = e.nativeEvent.layout;
                coordinates[i.id] = layout.x;
              }}
            >
              <Card
                marginHorizontal="$2"
                borderRadius="$8"
                width={width - 16}
                alignSelf="center"
              >
                <H5
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                >
                  {i.name}
                </H5>
                <Card.Footer
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                >
                  <YStack>
                    <H4 color="red">
                      Budgeted Expense - {new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(closerStackData[idx].stacks[1].value)}
                    </H4>
                    <H4 color="green">
                      Expected Income - {new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(closerStackData[idx].stacks[0].value)}
                    </H4>
                  </YStack>
                </Card.Footer>
              </Card>
            </XStack>
          )
        )}
      </ScrollView>
      <H4 marginHorizontal="$4" marginVertical="$2">
        Budgeted Vs Actual Expense
      </H4>
      <XStack alignItems="center" marginHorizontal="$4" marginVertical="$4">
        <H5>
          Legend :
        </H5>
        <XStack alignItems="center">
          <Circle size="$1" backgroundColor={colors.text} marginHorizontal="$3"/>
          <Paragraph>
            Budgeted Expense
          </Paragraph>
        </XStack>
        <XStack alignItems="center">
          <Circle size="$1" backgroundColor="#3251c7" marginHorizontal="$3"/>
          <Paragraph>
            Actual Expense
          </Paragraph>
        </XStack>
      </XStack>
      <XStack flex={1} justifyContent="center" marginVertical="$3">
        <BarChart
          data={closerBarData}
          rotateLabel
          isAnimated
          labelWidth={40}
          noOfSections={4}
          spacing={24}
          barWidth={32}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{color: colors.text}}
          xAxisLabelTextStyle={{color: colors.text}}
          frontColor={colors.text}
          onPress={(a, idx) => {
            budgetedVsActualScrollRef?.current?.scrollTo({x: coordinatesForExpense[filterDataForDashboard[Math.floor(idx / 2)].id]})
          }}
          autoCenterTooltip
          renderTooltip={(item) => <Paragraph
            marginLeft="$2"
          >{new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD'
          }).format(item.value)}</Paragraph>}
        />
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        ref={budgetedVsActualScrollRef}

      >
        {filterDataForDashboard.map((i, idx) => (
            <XStack
              key={i.id}
              marginVertical="$6"
              onLayout={e => {
                const layout = e.nativeEvent.layout;
                coordinatesForExpense[i.id] = layout.x;
              }}
            >
              <Card
                marginHorizontal="$2"
                borderRadius="$8"
                width={width - 16}
                alignSelf="center">
                <Card.Header>
                  <XStack justifyContent="space-between" alignItems="center">
                    <H5 flex={0.2}>
                      {i.name}
                    </H5>
                  </XStack>
                </Card.Header>
                <Separator borderWidth="$1" borderColor="darkgrey"/>
                <YStack marginVertical="$2" justifyContent="center">
                  <XStack textWrap="wrap" alignItems="center" justifyContent="center">
                    <H5 flex={0.4}>Category</H5>
                    <H5 flex={0.35}>Budgeted Amount</H5>
                    <H5 flex={0.2}>Actual Amount</H5>
                  </XStack>
                </YStack>
                <Separator borderWidth="$1" borderColor="darkgrey"/>
                {categoriesForExpense.map((item, index) => (
                  <YStack marginHorizontal="$2" marginVertical="$2" key={item.categoryName} justifyContent="center">
                    <XStack
                      justifyContent="space-between"
                      alignItems="center"
                      flexDirection="row"
                      onPress={() => {
                        const {categoryName} = item;
                        dispatch(setSelectedCategory({
                          isSelected: true,
                          categoryName,
                        }));
                        dispatch(setSelectedMonth({
                          isSelected: true,
                          month: i
                        }));
                        navigate('historyEntry');
                      }}
                    >
                      <XStack flex={0.4}>
                        <XStack
                          flexGrow={1}
                          alignItems="center"
                        >
                          {budgetedExpense[i.id].find(elm => elm.name == item.categoryName).value >= ((i.id in actualTransactions) ?
                            actualTransactions[i.id]
                              .reduce((acc, elm) => (elm.transactionTypeName == 'Expense' && elm.categoryType == item.categoryName) ? acc + Number(elm.amount) : acc, 0) : 0) ?
                            <Check color="green"/> : <Cross color="red"/>}
                          <H4 marginLeft="$1" textWrap="wrap" wordWrap="break-word"
                              flexWrap="wrap" color={
                            budgetedExpense[i.id].find(elm => elm.name == item.categoryName).value >= ((i.id in actualTransactions) ?
                              actualTransactions[i.id]
                                .reduce((acc, elm) => (elm.transactionTypeName == 'Expense' && elm.categoryType == item.categoryName) ? acc + Number(elm.amount) : acc, 0) : 0) ? 'green' : 'red'
                          }>{item.categoryName}</H4>
                        </XStack>

                      </XStack>
                      <XStack justifyContent="flex-end" flex={0.3}>
                        <H3>
                          {new Intl.NumberFormat('en-CA', {
                            style: 'currency',
                            currency: 'CAD'
                          }).format(budgetedExpense[i.id].find(elm => elm.name == item.categoryName).value)}
                        </H3>
                      </XStack>
                      <XStack
                        flex={0.3}
                        justifyContent="flex-end"
                      >
                        <H3 color="#3251c7">
                          {
                            new Intl.NumberFormat('en-CA', {
                              style: 'currency',
                              currency: 'CAD'
                            })
                              .format(
                                (i.id in actualTransactions) ?
                                  actualTransactions[i.id]
                                    .reduce((acc, elm) => (elm.transactionTypeName == 'Expense' && elm.categoryType == item.categoryName) ? acc + Number(elm.amount) : acc, 0) : 0,
                              )
                          }
                        </H3>
                      </XStack>
                    </XStack>
                    <Separator
                      borderWidth={StyleSheet.hairlineWidth}
                      borderColor="darkgrey"
                    />
                  </YStack>
                ))}
                <Card.Footer>
                  <XStack
                    marginVertical="$2"
                    marginHorizontal="$2"
                    flex={1}
                    textWrap="wrap"
                    alignItems="center"
                    justifyContent="space-around"
                  >
                    <H4 flex={0.3}>Total</H4>
                    <H4 flex={0.3} textAlign="right"
                        color={closerStackData[idx].stacks[1].value < closerBarData.find(elm => elm?.data?.id == i.id)?.value ? 'red' : 'green'}>
                      {new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD'
                      }).format(closerStackData[idx].stacks[1].value)}
                    </H4>
                    <H4 flex={0.3} textAlign="right"
                        color={closerStackData[idx].stacks[1].value < closerBarData.find(elm => elm?.data?.id == i.id)?.value ? 'red' : 'green'}>
                      {new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD'
                      }).format(closerBarData.find(elm => elm?.data?.id == i.id)?.value)}
                    </H4>
                  </XStack>
                </Card.Footer>
              </Card>
            </XStack>
          )
        )}
      </ScrollView>
    </ScrollView>
  );
};
