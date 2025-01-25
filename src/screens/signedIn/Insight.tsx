import {BarChart} from "react-native-gifted-charts";
// import {DropDown} from "../../components/DropDown";
import {H2, H5, ScrollView, View} from "tamagui";
import {useTheme} from "@react-navigation/native";
import {Text} from "tamagui";

export const Insight = () => {
  const barData = [
    {
      value: 40,
      label: 'Jan',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: 'purple'},
    {
      value: 50,
      label: 'Feb',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Mar',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Apr',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'May',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Jun',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Jul',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Aug',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Sep',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Oct',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Nov',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
    {
      value: 50,
      label: 'Dec',
      spacing: 2,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: 40, frontColor: 'purple'},
  ];
/*
* Bar Chart to depict actual vs budgeted expenses / income
* Pie Chart to show expenses
* Pie Chart to show income
* */
  const renderTitle = () => {
    return(
      <>
        <H5 textAlign="center">
          Budgeted vs Actual
        </H5>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 24,
            backgroundColor: useTheme().colors.card,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: '#177AD5',
                marginRight: 8,
              }}
            />
            <Text
              style={{

                height: 16,
                color: 'lightgray',
              }}>
              Budgeted
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View
              style={{
                height: 12,
                width: 12,
                borderRadius: 6,
                backgroundColor: 'purple',
                marginRight: 8,
              }}
            />
            <Text
              style={{
                width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              Actual
            </Text>
          </View>
        </View>
      </>
    )
  }
  return (
    <ScrollView>
      <H2 style={{paddingHorizontal: 8,}}>
       Demonstration purpose only
      </H2>
      <View style={{
        backgroundColor: useTheme().colors.card,
        marginHorizontal: 8,
        marginTop: 16,
        borderRadius: 10,
      }}>
        {renderTitle()}
      <BarChart
        data={barData}
        barWidth={14}
        spacing={24}
        roundedTop
        roundedBottom
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={{color: 'gray'}}
        noOfSections={3}
        maxValue={75}
      />
      </View>
    </ScrollView>
  );
}