import React, {useRef, useState} from 'react';
import {Check, Cross, Warning} from "../../icons";
import {BannerContainer} from "../../components/Banner/Container";
import {Card, Circle, H1, H4, H5, Paragraph, Progress, ScrollView, useWindowDimensions, XStack, YStack} from "tamagui";
import {DropDown} from "../../components/DropDown";
import {filterDataForDashboard} from "../../utils/filterDataForDashboard";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {BarChart} from "react-native-gifted-charts";
import {useTheme} from "@react-navigation/native";
export const Insight = () => {
  const budgetedExpense = useSelector((state: RootState) => state.budgetedExpense);
  const expectedIncome = useSelector((state: RootState) => state.expectedIncome);

  const [month, setMonth] = useState<Record<'name'| 'id', number | string>>(() => filterDataForDashboard[0]);
  const [coordinates, setCoordinates] = useState([]);
  const scrollRef = useRef();
  const closerStackData = filterDataForDashboard.map(data => ({
    label: data.name,
    stacks:[
      {value: expectedIncome[data.id].reduce((acc, elm) =>acc + Number(elm.value) ,0), color: 'green'},
      {value: budgetedExpense[data.id].reduce((acc, elm) =>acc + Number(elm.value) ,0), color: 'red'}
    ],
  }))
  const stackData = [
    {
      stacks: [
        {value: 12, color: 'red', text: 'Expense'},
        {value: 8, color: 'green',text: 'Income'},

      ],
      label: 'Jan'
    },
    {
      stacks: [
        {value: 10, color: 'red'},
        {value: 11, color: 'green', },

      ],
      label: 'Feb'
    },
    {
      stacks: [
        {value: 14, color: 'red'},
        {value: 18, color: 'green',},
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },
    {
      stacks: [

        {value: 11, color: 'red',  },
        {value: 10, color: 'green',  },
      ],

    },

  ];
const {height,width} = useWindowDimensions();
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
        <XStack alignItems="center" >
          <Circle size="$1" backgroundColor="red" marginHorizontal="$1"/>
          <Paragraph>
            Budgeted Expense
          </Paragraph>
        </XStack>
        <XStack alignItems="center" >
          <Circle size="$1" backgroundColor="green" marginHorizontal="$1"/>
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
       ref={scrollRef}
     >
       {filterDataForDashboard.map((i,idx) => (
         <XStack
           key={i.id}
           flex={1}
           onLayout={e => {
             const layout = e.nativeEvent.layout;
             coordinates[i.id] = layout.x;
           }}
         >
           <Card
             marginHorizontal="$3"
             borderRadius="$8"
             width={width - 24}
           >
             <Card.Header>
               <H5>
                 {i.name}
               </H5>
             </Card.Header>
             <Card.Footer paddingHorizontal="$3" paddingVertical="$2">
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
    </ScrollView>
  );
};

