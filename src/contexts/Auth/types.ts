import  {ReactNode} from "react";
import {AuthUser, ConfirmSignUpInput, SignInInput, SignUpInput, ConfirmResetPasswordInput, ResetPasswordInput} from "aws-amplify/auth";

export type AuthContextType = {
  children: ReactNode;
}
export interface AuthProviderProps  {
  register: (args: SignUpInput) => Promise<void>;
  confirmUser: (args: ConfirmSignUpInput) => Promise<void>;
  logIn: (args: SignInInput) => Promise<void>;
  logout: () => Promise<void>;
  ab: AuthUser | null | undefined;
  passwordResetRequest: (args: ResetPasswordInput) => Promise<void>;
  passwordResetConfirmation: (args: ConfirmResetPasswordInput) => Promise<void>;
}