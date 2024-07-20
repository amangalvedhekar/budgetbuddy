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
  AuthUser
} from 'aws-amplify/auth'

const AuthContext = createContext<AuthProviderProps | null>(null);

const AuthProvider = ({children}: AuthContextType) => {
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
          console.log(username, 'user name')
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
      setAb(x);
    } catch (e) {
      console.log(JSON.stringify(e), 'login call');
      throw e;
    }
  },[])

  const logout = useCallback(async () => {
    try {
      await signOut();
      setAb(null);
    } catch (e) {
      console.log(e, 'hmm cant loogut')
    }
  }, [])

  return <AuthContext.Provider
    value={{
      register,
      confirmUser,
      logIn,
      ab,
      logout,
    }}
  >
    {ab === undefined ? <></>: children}
  </AuthContext.Provider>;
}

export {
  AuthProvider,
  AuthContext,
};