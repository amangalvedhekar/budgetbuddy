import {Button, Card, H3, Input, YStack} from "tamagui";
import {useCallback, useState} from "react";
import {useAuth} from "../../hooks";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParams} from "../../navigation/types";

export const ConfirmationCode = ({route}: { route: RouteProp<RootStackParams> }) => {
  const {confirmUser} = useAuth();
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const {navigate} = useNavigation();
  const confirmAccount = useCallback(async (): Promise<void> => {
    try {
      await confirmUser({username: route.params?.username ?? '', confirmationCode});
      navigate('Welcome');
    } catch (e) {
    }
  }, [confirmationCode])
  return (

    <YStack padding="$4">
      <Card
        elevate
        padded
        borderRadius="$6"
        animation="bouncy"
        scale={0.9}
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}
      >
        <Card.Header>
          <H3 size="$6" fontWeight="bold" textAlign="center">
            Confirm Code
          </H3>
        </Card.Header>
        <Input
          placeholder="Email"
          size="$6"
          margin="$2"
          inputMode="email"
          autoComplete="email"
          textContentType="username"
          disabled={route.params?.username !== ''}
          opacity={route.params?.username !== '' ?0.6:1}
          value={route.params?.username}
        />
        <Input
          size="$6"
          margin="$2"
          maxLength={8}
          placeholder="Code"
          autoComplete="one-time-code"
          textContentType="username"
          keyboardType="number-pad"
          onChangeText={(e) => setConfirmationCode(e)}
        />
        <Card.Footer>
          <Button
            flex={1}
            size="$6"
            marginVertical="$3"
            onPress={confirmAccount}
          >
            Confirm Account
          </Button>
        </Card.Footer>
      </Card>
    </YStack>
  );
}