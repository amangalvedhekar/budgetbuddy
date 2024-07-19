import type {NavigationProp} from '@react-navigation/native';

export type RootStackParams = {
  SignIn: undefined;
  ForgotPassword: undefined;
  Register: undefined;
  Code: { username?: string };
  LandingScreen: undefined;
  Welcome: undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParams{

    }
  }
}
