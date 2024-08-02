import {Avatar, Button, Card, H4, Paragraph, XStack, YStack} from "tamagui";
import {useAuth} from "../../hooks";
import {useCallback} from "react";

export const Account = () => {
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
          <YStack  alignItems="center">
          <Avatar circular size="$14">
            <Avatar.Image
              accessibilityLabel="Cam"
              src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?&w=100&h=100&dpr=2&q=80"
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

    </YStack>
  )
};
