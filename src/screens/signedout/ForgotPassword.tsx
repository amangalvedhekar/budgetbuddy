import {Button, Card, H2, Input, Paragraph, ScrollView, SizableText, YStack} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useCallback, useState} from "react";
import Joi from "joi";
import {useAuth} from "../../hooks";
const emailValidation = Joi.object({
  email: Joi.string().required().email({tlds: false}),
});
const defaultValue = {
  value: '',
  isInvalid: false,
};
export const ForgotPassword = () => {
  const {passwordResetRequest} = useAuth();
  const {navigate} = useNavigation();
  const [email, setEmail] = useState(defaultValue);
  const handleOnPress = useCallback(async () => {
    try {
      await emailValidation.validateAsync({email: email.value});
      await passwordResetRequest({username: email.value});
      navigate('Code', {username: email.value, codeTrigger: 'passwordReset'});
    } catch (e) {
      console.log(e, 'inside error block');
      setEmail((prevState) => ({
        ...prevState,
        isInvalid: true,
      }));
    }

  },[email]);

  const handleChangeText = useCallback((e: string) => {
    setEmail((prevState) => ({
      ...prevState,
      isInvalid: false,
      value: e,
    }));
  }, []);

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
            value={email.value}
            {...(email.isInvalid ? {borderColor:"red"}: {})}
            onChangeText={handleChangeText}
          />
          {email.isInvalid ? <SizableText color="red" size="$5">Email entered is invalid</SizableText> : <></>}
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