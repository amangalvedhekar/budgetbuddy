import {Button, Card, H3, Input, YStack} from "tamagui";
import {useCallback, useState} from "react";
import {useAuth} from "../../hooks";
import {useNavigation} from "@react-navigation/native";
import {CodeProps} from "../../navigation/types";

export const ConfirmationCode = ({route}: CodeProps) => {
  const {confirmUser, passwordResetConfirmation} = useAuth();
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const {navigate} = useNavigation();
  const confirmAccount = useCallback(async (): Promise<void> => {
    try {
      if(route.params.codeTrigger === 'confirmAccount') {
        await confirmUser({username: route.params.username ?? '', confirmationCode});
        navigate('SignIn', {showPasswordResetBanner: false});
      } else {
        await passwordResetConfirmation({username: route.params.username, confirmationCode, newPassword});
        navigate('SignIn', {showPasswordResetBanner: true});
      }


    } catch (e) {
      console.log('whats wrong', e)
    }
  }, [confirmationCode, newPassword]);

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
          opacity={route.params?.username !== '' ? 0.6 : 1}
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
          onChangeText={setConfirmationCode}
        />
        {route.params.codeTrigger === 'passwordReset' ?  <Input
          size="$6"
          margin="$2"
          placeholder="new password"
          autoComplete="new-password"
          textContentType="newPassword"
          onChangeText={setNewPassword}
        />:<></>}
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