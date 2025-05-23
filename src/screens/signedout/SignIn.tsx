import {Button, Card, H4, Input, Paragraph, ScrollView, Separator, SizableText, YStack} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useAuth, useDb} from "../../hooks";
import {useCallback, useEffect, useState} from "react";
import {ActivityIndicator} from "react-native";
import {ErrorType, FormState} from "./Registration";
import Joi from "joi";
import {SignInProps} from "../../navigation/types";
import {useDispatch} from "react-redux";

const validationSchema = Joi.object({
  email: Joi.string().required().email({tlds: false}),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
})

export function SignIn({route}: SignInProps) {
  const {navigate} = useNavigation();
  const {logIn} = useAuth();
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

      await logIn({username: formState.email.value, password: formState.password.value});

    } catch (error: unknown) {

      if (Array.isArray((error as ErrorType)?.details)) {
        if ((error as ErrorType)?.details[0].path.includes('password')) {
          setFormState((formState) => ({...formState, password: {...formState.password, isInvalid: true}}));
        } else {
          setFormState((formState) => ({...formState, email: {...formState.email, isInvalid: true}}));
        }
      } else {
        setFormState((formState) => ({...formState, serverError: {...formState.email, isInvalid: true}}));
      }

    } finally {
      setFormState((prevState) => ({...prevState, isFormSubmitted: false}));
    }
  }, [formState]);
  return (
    <ScrollView>
      <YStack padding="$2">
        <Card
          elevate
          padded
          bordered
          animation="bouncy"
          scale={0.9}
          hoverStyle={{scale: 0.975}}
          pressStyle={{scale: 0.975}}
        >
          <Card.Header>
            <H4 size="$7" fontWeight="bold">
              Sign In to BudgetGenie
            </H4>
          </Card.Header>
          <Input
            placeholder="Email"
            marginVertical="$3"
            size="$6"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            textContentType="username"
            value={formState.email.value}
            {...(formState.email.isInvalid ? {borderColor: "red"} : {})}
            onChangeText={(e) => setFormState((formState) => ({
              ...formState,
              serverError: {...formState.serverError, isInvalid: false},
              email: {...formState.email, value: e, isInvalid: false}
            }))}
          />
          {formState.email.isInvalid ?
            <SizableText color="red" size="$5">Email entered is invalid</SizableText> : <></>}
          <Paragraph
            size="$6"
            onPress={() => navigate('ForgotPassword')}
            textAlign="right"
          >
            Forgot Password?
          </Paragraph>
          <Input
            placeholder="Password"
            marginVertical="$3"
            size="$6"
            secureTextEntry={true}
            {...(formState.password.isInvalid ? {borderColor: "red"} : {})}
            value={formState.password.value}
            onChangeText={(e) => setFormState((formState) => ({
              ...formState,
              serverError: {...formState.serverError, isInvalid: false},
              password: {...formState.password, value: e, isInvalid: false}
            }))}
          />

          {formState.password.isInvalid ?
            <SizableText color="red" size="$5">Password entered is invalid</SizableText> : <></>}
          {formState.serverError.isInvalid ?
            <SizableText color="red" size="$5">Email/Password incorrect. Try again!</SizableText> : <></>}
          <Button
            borderRadius="$8"
            size="$6"
            marginVertical="$3"
            onPress={onBackPress}
          >
            {formState.isFormSubmitted ? <ActivityIndicator size="small" color="purple"/> : 'Sign In'}
          </Button>
          <Card.Footer>
            <Paragraph
              size="$7"
              paddingVertical="$2"
              onPress={() => navigate('Register')}
            >
              New to BudgetGenie? Register
            </Paragraph>
          </Card.Footer>
        </Card>

      </YStack>
    </ScrollView>
  )
}