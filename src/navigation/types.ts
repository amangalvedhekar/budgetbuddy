import type {NavigationProp} from '@react-navigation/native';

export type RootStackParams = {
  SignIn: undefined;
  ForgotPassword: undefined;
  Register: undefined;
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParams{

    }
  }
}
