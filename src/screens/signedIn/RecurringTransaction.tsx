import {H5, H2, Card, YStack, H3, Paragraph, XStack} from "tamagui";
import {useNavigation, useTheme} from "@react-navigation/native";
import {ChevronRight} from "../../icons";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {SectionList} from "react-native";

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
    .reduce((acc:Array<any>, elm) => {
      const isElementPresent = acc?.findIndex(ac => ac?.title == elm.description);
      if (isElementPresent != -1) {
        const item = acc[isElementPresent];
        const newItem = {
          ...item,
          data: item?.data ? [...item?.data, elm]: [elm],
        };
        acc[isElementPresent] = newItem;
      }else {
        const item = {
          title: elm.description,
          data: [elm]
        };
        return acc?.concat(item);
      }
      return acc;
    }, []);
  return (
    <>
      <YStack justifyContent="flex-start" flex={1} padding="$4">

        <SectionList
          sections={sectionData}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({section: {title, data}}) => (
            <H2>{title} - {data.length} transactions</H2>
          )}
          renderItem={({item}) =>(
            <Card
              key={item.id}
              borderRadius="$6"
              marginVertical="$2"
              onPress={() => {
                navigation.navigate('historyEntryDetails', {entryId: item.id});
              }}
            >
              <Card.Header>
                <XStack justifyContent="space-between">
                  <H5>
                    {item.description}-{new Intl.NumberFormat('en-CA', {
                    style: 'currency',
                    currency: 'CAD'
                  }).format(item.amount)}
                  </H5>
                  <ChevronRight
                    color={colors.text}
                  />
                </XStack>
              </Card.Header>
              <Card.Footer paddingHorizontal="$3" paddingBottom="$2">
                <XStack
                  style={{
                    borderWidth: 2,
                    borderRadius: 8,
                    borderColor: colors.border
                  }}>
                  <Paragraph paddingHorizontal="$3" margin="$1">
                    {item.categoryType}
                  </Paragraph>
                </XStack>
                <XStack
                  style={{
                    borderWidth: 2,
                    borderRadius: 8,
                    borderColor: colors.border,
                    paddingHorizontal: 8,
                    marginHorizontal: 8
                  }}>
                  <Paragraph paddingHorizontal="$3" margin="$1">
                    {item.isRecurringTransaction}
                  </Paragraph>
                </XStack>
              </Card.Footer>
            </Card>
          )}
        />
      </YStack>
    </>
  )
}