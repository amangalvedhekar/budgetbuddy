import {useEffect, useState} from "react";
import {hideAsync, preventAutoHideAsync} from "expo-splash-screen";
import {getCurrentUser} from "aws-amplify/auth";

export const useCachedResources = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        await preventAutoHideAsync();

        await hideAsync();
      } catch (e) {
console.error(e);
      } finally {
        setIsLoadingComplete(true);
      }
    })();
  }, []);

  return isLoadingComplete;
}