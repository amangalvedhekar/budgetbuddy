import {Avatar, Button, Card, H4, XStack, YStack} from "tamagui";
import {useAuth} from "../../hooks";
import {useCallback, useState} from "react";
import {useNavigation} from "@react-navigation/native";

export const Account = () => {
  const {ab, logout} = useAuth();
  const {navigate} = useNavigation();
  const onBackPress = useCallback(async () => {
    await logout();
  },[]);
  const handlePress = () => {
    navigate('Categories');
  }
  const onCardPress = () => {
    navigate('plannedBudget');
  }
  return  (
    <YStack justifyContent="flex-start" flex={1} padding="$4">
      <Card
        elevate
        padded
        borderRadius="$8"
        animation="bouncy"
        scale={0.5}
        hoverStyle={{ scale: 0.925 }}
        pressStyle={{ scale: 0.875 }}
      >
        <Card.Header>
          <YStack  alignItems="center">
            <Avatar circular size="$8">
              <Avatar.Image
                accessibilityLabel="Cam"
              />
              <Avatar.Fallback backgroundColor="purple" />
            </Avatar>
            <H4 size="$6" fontWeight="bold" textAlign="center" style={{textTransform:'lowercase',}}>
              {ab?.signInDetails?.loginId}
            </H4>
          </YStack>

        </Card.Header>
        <Button onPress={onBackPress}>
          Logout
        </Button>
      </Card>
      <Card
        elevate
        borderRadius="$8"
        marginVertical="$2"
        animation="bouncy"
        scale={0.5}
        hoverStyle={{ scale: 0.925 }}
        onPress={handlePress}
        pressStyle={{ scale: 0.875 }}
      >
        <XStack marginVertical="$4" paddingHorizontal="$4">
          <H4 size="$6" fontWeight="bold">
            Categories
          </H4>
        </XStack>
      </Card>
      <Card
        elevate
        borderRadius="$8"
        marginVertical="$2"
        animation="bouncy"
        scale={0.5}
        hoverStyle={{ scale: 0.925 }}
        onPress={onCardPress}
        pressStyle={{ scale: 0.875 }}
      >
        <XStack marginVertical="$4" paddingHorizontal="$4">
          <H4 size="$6" fontWeight="bold">
            Budgeted Expenses
          </H4>
        </XStack>
      </Card>

    </YStack>
  )
};