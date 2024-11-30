import {H2} from "tamagui";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {useCallback} from "react";

export const Details = () => {
  const {setOptions} = useNavigation();

  useFocusEffect(useCallback(() => {
    setOptions({headerTitle: 'Update title to transaction info'})
  },[]));
  return (
    <H2>
      details of transaction
      Edit delete
    </H2>
  );
}