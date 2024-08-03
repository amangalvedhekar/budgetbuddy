import {Button, Paragraph, View, useTheme, H2, XStack, Input, YStack,} from "tamagui";
import {BottomSheetModal, BottomSheetView, BottomSheetTextInput, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {useCallback, useMemo, useRef} from "react";
import {StyleSheet} from "react-native";
import {Plus} from "../../icons";

export const Home = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // variables
  const snapPoints = useMemo(() => ['55%'], []);
const theme = useTheme();
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  return  (
    <>
      <XStack gap="$4" margin="$4" justifyContent="flex-end">
        <Button icon={() => <Plus color={theme?.color?.get?.()}/>} size="$5" onPress={handlePresentModalPress}/>
      </XStack>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{backgroundColor: theme?.background?.get()}}
      >
        <BottomSheetScrollView style={{paddingHorizontal: 26}}>
          <H2 textAlign="center">Add transaction</H2>
          <YStack marginVertical="$2">
            <BottomSheetTextInput
              placeholder="description"
              placeholderTextColor={theme?.color?.get?.()}
              style={
              {
                height: 60,
                margin: 8,
                paddingLeft:16,
                borderRadius:16,
                borderColor: theme?.color?.get?.(),
                borderWidth:1,
                flex:1
              }}
            />
            <BottomSheetTextInput
              placeholder="Amount"
              placeholderTextColor={theme?.color?.get?.()}
              style={
              {
                height: 60,
                margin: 8,
                paddingLeft:16,
                borderRadius:16,
                borderColor: theme?.color?.get?.(),
                borderWidth:1,
                flex:1
              }}/>
            <BottomSheetTextInput
              placeholder="date"
              placeholderTextColor={theme?.color?.get?.()}
              style={{height: 60, margin: 8,borderRadius:16,paddingLeft:16,borderColor: theme?.color?.get?.(), borderWidth:1, flex:1}}
            />
          </YStack>
          <Button
            borderRadius="$8"
            size="$6"
            marginVertical="$3"
            onPress={() => bottomSheetModalRef?.current?.dismiss()}
          >Done</Button>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
