import {Avatar, Button, Card, H1, H4, H5, H6, ScrollView, Separator, XStack, YStack} from "tamagui";
import {useAuth} from "../../hooks";
import {useCallback, useEffect,} from "react";
import {useNavigation, useRoute, useTheme} from "@react-navigation/native";
import {ChevronRight} from "../../icons";

export const Account = () => {
  const {ab, logout} = useAuth();
  const {navigate, } = useNavigation();
  const {params} = useRoute();
  const {colors} = useTheme();
  const onBackPress = useCallback(async () => {
    await logout();
  }, []);
  const handlePress = () => {
    navigate('Categories');
  }
  const onCardPress = () => {
    navigate('Months', {transactionType: '1'});
  }
  const onIncomePress = () => {
    navigate('Months', {transactionType: '0'});
  }
  const onAppSettingPress = () => navigate('appSettings');

  const onRecurringTransactionPress = () => navigate('recurringTransactions');

  useEffect(() => {
    if(params) {
      if(params.name && params.name!='') {
        navigate('addCategory', {
          name: params.name, id: params.id
        });
        return;
      }
      if(params.screen == 'recurringTransaction') {
        navigate('recurringTransactions');
        return;
      }
    }
  }, [params]);
  const accountCardItems = [
    {
      title: 'Monthly Budgeted Expenses',
      footerText: 'Budget expected expenses on monthly basis',
      onPress: onCardPress,
    },
    {
      title: 'Monthly Expected Income',
      footerText: 'Expected income on monthly basis',
      onPress: onIncomePress,
    },
    {
      title: 'Categories',
      footerText: 'View, create or edit categories',
      onPress: handlePress,
    },
    {
      title: 'Recurring Transactions',
      footerText: 'View, create or edit recurring transactions',
      onPress: onRecurringTransactionPress,
    },
    {
      title: 'App Settings',
      footerText: 'Appearance settings',
      onPress: onAppSettingPress,
    }
  ];
  return (
    <ScrollView contentContainerStyle={{paddingBottom: 32}}>
      <YStack justifyContent="flex-start" flex={1} padding="$4">
        <Card
          padded
          borderRadius="$8"
        >
          <Card.Header>
            <YStack alignItems="center">
              <Avatar circular size="$8">
                <Avatar.Image
                  accessibilityLabel="Cam"
                />
                <Avatar.Fallback backgroundColor="purple"/>
              </Avatar>
              <H4 size="$6" fontWeight="bold" textAlign="center" style={{textTransform: 'lowercase',}}>
                {ab?.signInDetails?.loginId}
              </H4>
            </YStack>

          </Card.Header>
          <Button onPress={onBackPress}>
            Logout
          </Button>
        </Card>
        {
          accountCardItems.map(item => (
            <Card
              key={item.title}
              elevate
              borderRadius="$8"
              marginVertical="$2"
              onPress={item.onPress}
            >
              <XStack marginVertical="$4" paddingHorizontal="$4" justifyContent="space-between">
                <H4 size="$6" fontWeight="bold">
                  {item.title}
                </H4>
                <ChevronRight
                  color={colors.text}
                />
              </XStack>
              <Separator/>
              <Card.Footer padding="$2">
                <H5 paddingHorizontal="$3">
                  {item.footerText}
                </H5>
              </Card.Footer>
            </Card>
          ))
        }
      </YStack>
    </ScrollView>
  )
};
