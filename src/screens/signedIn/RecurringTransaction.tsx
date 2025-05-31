import {H5, H2, Card, YStack, H3, Paragraph, XStack, Accordion, Square, ScrollView, Checkbox, H4} from "tamagui";
import {useNavigation, useTheme} from "@react-navigation/native";
import {Check, ChevronDown, ChevronRight} from "../../icons";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {SectionList} from "react-native";
import {categories} from "../../utils";
import {setSelectedCategory} from "../../features/transactionFilterSlice";
import React from "react";

export const RecurringTransaction = () => {
  const {colors} = useTheme();
  const currentDate = new Date();
  const navigation = useNavigation();
  const currentYear = currentDate.getUTCFullYear();
  const transactionList = useSelector((state: RootState) => state.transactionList);
  const transactionListByMonth = transactionList[currentYear] ?? {};
  const recurringTransaction = Object
    .values(transactionListByMonth)
    .flatMap(transaction => transaction)
    .filter(transaction => transaction.isRecurringTransaction == 'monthly');

  const sectionData = recurringTransaction
    .reduce((acc: Array<any>, elm) => {
      const isElementPresent = acc?.findIndex(ac => ac?.title == elm.description);
      if (isElementPresent != -1) {
        const item = acc[isElementPresent];
        const newItem = {
          ...item,
          data: item?.data ? [...item?.data, elm] : [elm],
        };
        acc[isElementPresent] = newItem;
      } else {
        const item = {
          title: elm.description,
          data: [elm]
        };
        return acc?.concat(item);
      }
      return acc;
    }, []);
const createdDate = (date) => {
  const dateObject = new Date(date);
  const modified = dateObject.setTime(dateObject.getTime() + 955 * 60 * 1000);

  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    dateStyle: 'long',
  }).format(modified);
  return formattedDate;
}
  return (
    <ScrollView>
      <YStack justifyContent="flex-start" flex={1} padding="$4">
        {sectionData.map(transaction => (
          <Accordion
            overflow="hidden"
            type="multiple"
            marginVertical="$4"
            borderRadius="$8"
            key={transaction.title}
          >
            <Accordion.Item value="a1">
              <Accordion.Trigger flexDirection="row" justifyContent="space-between">
                {({
                    open,
                  }: {
                  open: boolean
                }) => (
                  <>
                    <H4>
                      {transaction?.title} - {transaction?.data?.length} transactions
                    </H4>
                    <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                      <ChevronDown color={colors.text}/>
                    </Square>
                  </>
                )}
              </Accordion.Trigger>
              <Accordion.HeightAnimator animation="medium">
                <Accordion.Content
                  animation="medium"
                  exitStyle={{opacity: 0}}
                >
                  {transaction?.data.map(trx => (
                    <YStack key={trx.id}>
                    <XStack
                      justifyContent="space-between"
                      marginVertical="$3"
                      onPress={() => {
                        navigation.navigate('historyEntryDetails', {entryId: trx.id});
                      }}
                    >
                      <H5>
                        {trx?.description} - {new Intl.NumberFormat('en-CA', {
                        style: 'currency',
                        currency: 'CAD'
                      }).format(trx.amount)}
                      </H5>
                      <ChevronRight color={colors.text}/>
                    </XStack>
                      <XStack>
                        <H5>
                          {createdDate(trx.createdDate)}
                        </H5>
                      </XStack>
                    </YStack>
                  ))}
                </Accordion.Content>
              </Accordion.HeightAnimator>
            </Accordion.Item>
          </Accordion>
        ))}

      </YStack>
    </ScrollView>
  )
}