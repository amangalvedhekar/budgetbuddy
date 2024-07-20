import {useContext} from "react";
import {AuthContext} from "../contexts";

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (authContext == undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return authContext;
}