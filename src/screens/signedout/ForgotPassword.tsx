import {Button, Card, H2, Input, Paragraph, ScrollView, YStack} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useCallback} from "react";

export const ForgotPassword = () => {
  const {navigate} = useNavigation();
  const handleOnPress = useCallback(() => {
    navigate('Code', {username: 'qaw@www.com'});
  },[]);

  return (
    <ScrollView>
      <YStack padding="$4">
        <Card
          elevate
          padded
          borderRadius="$8"
          animation="bouncy"
          scale={0.9}
          hoverStyle={{scale: 0.975}}
          pressStyle={{scale: 0.975}}
        >
          <H2>
            Reset your password
          </H2>
          <Paragraph size="$6">
            Enter the email address associated with your account to reset your password
          </Paragraph>
          <Input
            placeholder="Email"
            marginVertical="$3"
            size="$6"
            inputMode="email"
            autoComplete="email"
            textContentType="username"
          />
          <Card.Footer>
            <Button
              flex={1}
              borderRadius="$8"
              size="$6"
              marginVertical="$3"
              onPress={handleOnPress}
            >
              Continue
            </Button>
          </Card.Footer>
        </Card>
      </YStack>
    </ScrollView>
  )
}