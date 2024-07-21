import {useAuth} from "../../hooks";
import {useCallback} from "react";
import {Button, Card, H4, YStack} from "tamagui";

export const Home = () => {
  const {ab, logout} = useAuth();
  const onBackPress = useCallback(async () => {
    await logout();
  },[]);

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
          <H4 size="$6" fontWeight="bold" textAlign="center">
            Welcome user - {ab?.signInDetails?.loginId}
          </H4>
        </Card.Header>
        <Button onPress={onBackPress}>
          Logout
        </Button>
      </Card>

    </YStack>
  )
}