import {
  Button,
  Card,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  YStack,
  H4, SizableText
} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useAuth} from "../../hooks";
import Joi from "joi";
import {ActivityIndicator} from "react-native";

export type Field = {
  value: string,
  isInvalid: boolean,
};
export interface FormState  {
  email: Field,
  password: Field;
  serverError: Field,
  isFormSubmitted: boolean,
}
export type ErrorRecord = {
  [key: string]: string | Array<string>;
};
export type ErrorType = {
  details: Array<ErrorRecord>;
}

const validationSchema = Joi.object({
  email: Joi.string().required().email({tlds: false}),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
})
export const Registration = () => {

  const {navigate} = useNavigation();
  const {register} = useAuth();
  const [formState, setFormState] = useState<FormState>({
    email: {
      value: '',
      isInvalid: false,
    },
    password: {
      value: '',
      isInvalid: false,
    },
    serverError: {
      isInvalid: false,
      value: '',
    },
    isFormSubmitted: false,
  });
  const onBackPress = useCallback(async () => {
    try {

      setFormState((prevState) => ({...prevState, isFormSubmitted: true}));
      await validationSchema.validateAsync({email: formState.email.value, password: formState.password.value});

      await register({username: formState.email.value?.toLowerCase(), password: formState.password.value});
      navigate('Code', {username: formState.email.value.toLowerCase()});
    } catch (error: unknown) {

      if (Array.isArray((error as ErrorType)?.details)) {
        if ((error as ErrorType)?.details[0]?.path.includes('password')) {
          setFormState((formState) => ({...formState, password: {...formState.password, isInvalid: true}}));
        } else {
          setFormState((formState) => ({...formState, email: {...formState.email, isInvalid: true}}));
        }
      } else{
        setFormState((formState) => ({...formState, serverError: {...formState.email, isInvalid: true}}));
      }

    } finally {
      setFormState((prevState) => ({...prevState, isFormSubmitted: false}));
    }
  }, [formState]);
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
          <Card.Header>
            <H4 size="$7" fontWeight="bold">
              Welcome to BudgetBuddy
            </H4>
          </Card.Header>
          <Input
            placeholder="Email"
            marginVertical="$3"
            size="$6"
            inputMode="email"
            autoComplete="email"
            textContentType="username"
            value={formState.email.value}
            {...(formState.email.isInvalid ? {borderColor:"red"}: {})}
            onChangeText={(e) => setFormState((formState) => ({...formState, serverError: {...formState.serverError, isInvalid: false},email: {...formState.email, value: e, isInvalid: false}}))}
          />
          {formState.email.isInvalid ? <SizableText color="red" size="$5">Email entered is invalid</SizableText> : <></>}
          <Input
            placeholder="Password"
            marginVertical="$3"
            size="$6"
            secureTextEntry={true}
            {...(formState.password.isInvalid ? {borderColor:"red"}: {})}
            // textContentType="newPassword"
            // autoComplete="new-password"
            value={formState.password.value}
            onChangeText={(e) => setFormState((formState) => ({...formState, serverError: {...formState.serverError, isInvalid: false},password: {...formState.password, value: e, isInvalid: false}}))}
          />

          {formState.password.isInvalid ? <SizableText color="red" size="$5">Password entered is invalid</SizableText>: <></>}
          {formState.serverError.isInvalid ? <SizableText color="red" size="$5">Email/Password incorrect. Try again!</SizableText>: <></>}
          <Button
            borderRadius="$8"
            size="$6"
            marginVertical="$3"
            onPress={onBackPress}
          >
            {formState.isFormSubmitted ?<ActivityIndicator size="small" color="purple"/>: 'Register'}
          </Button>
          <Separator/>
          <Card.Footer padded>
            <Paragraph size="$6" onPress={() => navigate('SignIn')} color="purple">Already member? Sign In</Paragraph>
          </Card.Footer>
        </Card>

      </YStack>
    </ScrollView>
  )
}
