import {createContext, useCallback, useEffect, useState} from "react";
import {AuthContextType, AuthProviderProps} from "./types";
import {
  confirmSignUp,
  signUp,
  signIn,
  SignUpInput,
  ConfirmSignUpInput,
  SignInInput,
  getCurrentUser,
  signOut,
  AuthUser,
  resetPassword,
  confirmResetPassword,
  ResetPasswordInput,
  ConfirmResetPasswordInput,
} from 'aws-amplify/auth'
import {useDb} from "../../hooks";
import {UserLists} from "../../../schema";
import {eq} from "drizzle-orm";
import {useDispatch} from "react-redux";
import {removeUser} from "../../features/usersSlice";
import {resetTransactionData} from "../../features/transactionListSlice";

const AuthContext = createContext<AuthProviderProps | null>(null);

const AuthProvider = ({children}: AuthContextType) => {
  const {db} = useDb();
  const dispatch = useDispatch();
  const [ab, setAb] = useState<AuthUser | null | undefined>(undefined);
  useEffect(() => {
    (async () => {
      try {
        const x = await getCurrentUser();
        setAb(x);
      } catch (e) {
        setAb(null);
        console.error(e);
      }
    })();
  }, []);
  const register =
    useCallback(
      async ({username, password}: SignUpInput) => {
        try {
          const user = await signUp({username, password});
          // return user;
        } catch (e) {
          throw e;
        }

      }, []);


  const confirmUser = useCallback(async ({username, confirmationCode}: ConfirmSignUpInput) => {
    try {
      await confirmSignUp({username, confirmationCode})
    } catch (e) {
      throw e;
    }
  }, []);

  const logIn = useCallback(async ({username, password}: SignInInput) => {
    try {
      await signIn({username, password, options: {authFlowType: 'USER_PASSWORD_AUTH'}});
      const x = await getCurrentUser();
      const dataToAdd = {
        userId: x?.userId,
        isUserOnboarded: false,
      };
      const isUserAdded = await db
        .select()
        .from(UserLists)
        .where(eq(UserLists.userId, x?.userId));

      if (Array.isArray(isUserAdded) && isUserAdded.length === 0) {
        await db.insert(UserLists).values(dataToAdd);
      }

      setAb(x);
    } catch (e) {
      console.log(JSON.stringify(e), 'login call');
      throw e;
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await signOut();
      dispatch(resetTransactionData());
      dispatch(removeUser());
      setAb(null);
    } catch (e) {
      console.log(e, 'hmm cant logout')
    }
  }, []);

  const passwordResetRequest = useCallback(async ({username}: ResetPasswordInput) => {
    try {
      await resetPassword({username});
    } catch (e) {

    }
  }, []);

  const passwordResetConfirmation = useCallback(
    async (
      {
        username,
        confirmationCode,
        newPassword
      }: ConfirmResetPasswordInput) => {
      try {
        await confirmResetPassword({username, confirmationCode, newPassword})
      } catch (e) {

      }
    }, []);

  return <AuthContext.Provider
    value={{
      register,
      confirmUser,
      logIn,
      ab,
      logout,
      passwordResetConfirmation,
      passwordResetRequest
    }}
  >
    {ab == undefined ? <></> : children}
  </AuthContext.Provider>;
}

export {
  AuthProvider,
  AuthContext,
};