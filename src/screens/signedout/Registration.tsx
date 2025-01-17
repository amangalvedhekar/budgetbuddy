import {
  Button,
  Card,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  YStack,
  H4,
  SizableText,
  XStack, H5
} from "tamagui";
import {useNavigation} from "@react-navigation/native";
import {useCallback, useState} from "react";
import {useAuth} from "../../hooks";
import Joi from "joi";
import {ActivityIndicator} from "react-native";
import {Check, Cross} from "../../icons";

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
export type Fields = 'email' | 'password';

const validationSchema = Joi.object({
  email: Joi.string().required().email({tlds: false}),
  password: Joi.string().min(8).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
});

const validationConditions = [
  {message: 'Must contain lowercase', name: 'caseSensitiveLowerCaseRequirement', isEntered: false, pattern: /[a-z]/},
  {message: 'Must contain digit', isEntered: false, name: 'minimumDigitRequirement', pattern: /(?=.*[0-9])/},
  {message:  'Must contain special character', name: 'specialCharacterRequirement', isEntered: false, pattern: /(?=.*[#^@$!%*?&-+._~=-])/},
  {message:'Must contain uppercase', name: 'caseSensitiveUpperCaseRequirement', isEntered: false, pattern: /[A-Z]/},
  {message: 'Must contain minimum 8 characters', name: 'minimumLengthRequirement', isEntered: false, pattern:  /^.{8,256}$/},
];

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
  const [passwordRequirement, setPasswordRequirement] = useState(validationConditions);
  const onRegister = useCallback(async () => {
    try {

      setFormState((prevState) => ({...prevState, isFormSubmitted: true}));
      await validationSchema.validateAsync({email: formState.email.value, password: formState.password.value});

      await register({username: formState.email.value?.toLowerCase(), password: formState.password.value});
      navigate('Code', {username: formState.email.value.toLowerCase(), codeTrigger: 'confirmAccount'});
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

  const onPress = useCallback(() => {
    navigate('SignIn',{showPasswordResetBanner: false});
  },[]);

  const onTextChange = useCallback((field: Fields) => (e: string) =>{

    setFormState((previousFormState) => ({
      ...previousFormState,
      serverError: {
        ...previousFormState.serverError,
        isInvalid: false,
      },
      [field]: {
        ...previousFormState[field],
        value: e,
        isInvalid: false,
    }
    }));

    const liveValidatedRequirement = passwordRequirement.map(condition => {
      if(condition.pattern.test(e)){
        return ({
          ...condition,
          isEntered: true,
        });
      }
      return ({...condition, isEntered: false});
    });

    setPasswordRequirement(liveValidatedRequirement);

  },[]);

  return (
    <ScrollView>
      <YStack padding="$2">
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
            <H5 fontWeight="bold">
              Welcome to BudgetGenie
            </H5>
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
            onChangeText={onTextChange('email')}
          />
          {formState.email.isInvalid ? <SizableText color="red" size="$5">Email entered is invalid</SizableText> : <></>}
          <Input
            placeholder="Password"
            marginVertical="$3"
            size="$6"
            secureTextEntry={true}
            {...(formState.password.isInvalid ? {borderColor:"red"}: {})}
            textContentType="newPassword"
            autoComplete="new-password"
            value={formState.password.value}
            onChangeText={onTextChange('password')}
          />

          {formState.password.isInvalid ? <SizableText color="red" size="$5">Password entered is invalid</SizableText>: <></>}
          {formState.serverError.isInvalid ? <SizableText color="red" size="$5">Email/Password incorrect. Try again!</SizableText>: <></>}

          {formState.password.value !== '' && <YStack>
            {passwordRequirement.map(condition => (
              <XStack gap="$2" paddingVertical="$2" key={condition.name}>
                {condition.isEntered ?<Check color="green"/> : <Cross color="red" /> }
                <Paragraph size="$5" paddingVertical="$1" color={condition.isEntered ? 'green' : 'red'}>
                  {condition.message}
                </Paragraph>
              </XStack>
            ))}

          </YStack>}
          <Button
            borderRadius="$8"
            size="$6"
            marginVertical="$3"
            onPress={onRegister}
          >
            {formState.isFormSubmitted ?<ActivityIndicator size="small" color="purple"/>: 'Register'}
          </Button>
          <Separator/>
          <Card.Footer padded>
            <Paragraph
              size="$7"
              paddingVertical="$2"
              onPress={onPress}
            >
              Already member? Sign In
            </Paragraph>
          </Card.Footer>
        </Card>
      </YStack>
    </ScrollView>
  );
}
