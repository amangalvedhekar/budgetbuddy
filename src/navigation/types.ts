import type {NativeStackScreenProps} from "react-native-screens/native-stack";

export type CodeTrigger = 'passwordReset' | 'confirmAccount';

export type RootStackParams = {
  SignIn: { showPasswordResetBanner: boolean };
  ForgotPassword: undefined;
  Register: undefined;
  Code: { username: string, codeTrigger: CodeTrigger};
  LandingScreen: undefined;
  Home: undefined;
}
export type CodeProps = NativeStackScreenProps<RootStackParams, 'Code'>;
export type SignInProps = NativeStackScreenProps<RootStackParams, 'SignIn'>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParams{

    }
  }
}
