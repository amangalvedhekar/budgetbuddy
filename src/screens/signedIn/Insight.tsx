import React, {useRef, useState} from 'react';
import {Check, Cross, Warning} from "../../icons";
import {BannerContainer} from "../../components/Banner/Container";
import {
  Card,
  Circle,
  H1, H3,
  H4,
  H5,
  Paragraph,
  Progress,
  ScrollView,
  Separator,
  useWindowDimensions,
  XStack,
  YStack
} from "tamagui";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {BarChart} from "react-native-gifted-charts";
import {useTheme} from "@react-navigation/native";
import {StyleSheet} from "react-native";
//play-console-service-account@budgetgenie-455211.iam.gserviceaccount.com
export const Insight = () => {
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);
  const categories = useSelector((state: RootState) => state.categories);
  const categoriesForExpense = categories.filter(elm => elm.transactionName == 'Expense')
  const [coordinates, setCoordinates] = useState([]);
  const scrollRef = useRef();
  const closerStackData = filterDataForDashboard.map(data => ({
    label: data.name,
    stacks: [
      {value: expectedIncome[data.id].reduce((acc, elm) => acc + Number(elm.value), 0), color: 'green'},
      {value: budgetedExpense[data.id].reduce((acc, elm) => acc + Number(elm.value), 0), color: 'red'}
    ],
  }));
  const closerBarData = filterDataForDashboard.flatMap(data => {
    const budgetedData = {
      value: budgetedExpense[data.id].reduce((acc, elm) => acc + Number(elm.value), 0),
      label: data.name,
      spacing: 2,

    };
    const actualData = {
      value: Math.random() * (900 - 100) + 100,
      frontColor: '#3251c7'
    };
    return [
      {...budgetedData},
      {...actualData}
    ]
  });

  const {width} = useWindowDimensions();
  const {colors} = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{paddingBottom: 72}}
    >
      <H4 marginHorizontal="$4" marginVertical="$2">
        Budgeted Expense & Expected Income
      </H4>
      <XStack alignItems="center" marginHorizontal="$4" marginVertical="$4">
        <H5>
          Legend :
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
      <XStack flex={1} justifyContent="center" marginVertical="$3">
        <BarChart
          noOfSections={4}
          stackData={closerStackData}
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
            scrollRef?.current?.scrollTo({x: coordinates[idx]})
            console.log('on press', idx);
          }}
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
                <Card.Header>
                  <H5>
                    {i.name}
                  </H5>
                </Card.Header>
                <Card.Footer paddingHorizontal="$3" paddingVertical="$1">
                  <YStack>
                    <H4 color="red">
                      Expense - {new Intl.NumberFormat('en-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(closerStackData[idx].stacks[1].value)}
                    </H4>
                    <H4 color="green">
                      Income - {new Intl.NumberFormat('en-CA', {
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
        Budgeted VS Actual Expense
      </H4>
      <XStack alignItems="center" marginHorizontal="$4" marginVertical="$4">
        <H5>
          Legend :
        </H5>
        <XStack alignItems="center">
          <Circle size="$1" backgroundColor="black" marginHorizontal="$3"/>
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
          labelWidth={40}
          barBorderRadius={8}
          noOfSections={4}
          spacing={24}
          barWidth={48}
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{color: colors.text}}
          xAxisLabelTextStyle={{color: colors.text}}
          maxValue={7500}
        />
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"

      >
        {filterDataForDashboard.map((i, idx) => (
            <XStack
              key={i.id}
              marginVertical="$6"
            >
              <Card
                marginHorizontal="$2"
                borderRadius="$8"
                width={width - 16}
                alignSelf="center">
                <Card.Header>
                  <H5>
                    {i.name}
                  </H5>
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
                    <XStack justifyContent="space-between" alignItems="center" flexDirection="row">
                      <XStack flex={0.4}>
                        <XStack
                          flexGrow={1}
                          alignItems="center"
                        >
                          <Check color="green"/>
                          <H4 marginLeft="$2">{item.categoryName}</H4>
                        </XStack>

                      </XStack>
                      <H3
                        flex={0.35}
                      >
                        {new Intl.NumberFormat('en-CA', {
                          style: 'currency',
                          currency: 'CAD'
                        }).format(budgetedExpense[i.id].find(elm => elm.name == item.categoryName).value)}
                      </H3>
                      <H3
                        flex={0.2}
                        color="#3251c7"
                      >
                        $430
                      </H3>
                    </XStack>
                    {index < categoriesForExpense.length - 1 &&
                      <Separator borderWidth={StyleSheet.hairlineWidth} borderColor="darkgrey"/>}
                  </YStack>
                ))}
              </Card>
            </XStack>
          )
        )}
      </ScrollView>
    </ScrollView>
  );
};


