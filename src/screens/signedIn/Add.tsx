import {Button, Card, H1, H4, Input, Label, RadioGroup, Separator, useTheme, XStack, YStack} from "tamagui";
import {ChevronDown, Plus} from "../../icons";
import {JSX, useCallback, useMemo, useRef, useState} from "react";
import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import {
  BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Keyboard, KeyboardAvoidingView, TextInput} from "react-native";

export const Add = () => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['35%', '35%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );
  const [showBanner, setShowBanner] = useState(false);
  const amountRef = useRef<TextInput>(null);
  return (
    <KeyboardAvoidingView >
      {showBanner ? <Card
        elevate
        margin="$2"
        borderRadius="$8"
        animation="bouncy"
        scale={0.9}
        size="$2"
        backgroundColor="green"
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}>
        <Card.Header>
          <H4 size="$7" fontWeight="bold" textAlign="center">
            Transaction Added Successfully
          </H4>
        </Card.Header>
      </Card>: <></>}
    <YStack>
      <Input
        margin="$2"
        size="$6"
        placeholder="description"
        returnKeyType="done"
        onSubmitEditing={() => amountRef?.current?.focus()}
      />

      <Input
        margin="$2"
        size="$6"
        placeholder="amount"
        keyboardType="numeric"
        returnKeyType="done"
        ref={amountRef}
        onSubmitEditing={handlePresentModalPress}
      />

      <Button
        borderRadius="$8"
        size="$6"
        margin="$2"
        iconAfter={() => <ChevronDown color={useTheme().color?.get()}/>}
        onPress={() => {
          Keyboard.dismiss();
          handlePresentModalPress();
        }}
      >
        Transaction Type
      </Button>
      <Button
        borderRadius="$8"
        size="$6"
        margin="$2"
        icon={() => <Plus color={useTheme().color?.get()}/>}
        onPress={() => setShowBanner(!showBanner)}
      >
        Add Transaction
      </Button>
      <BottomSheetModal ref={bottomSheetModalRef}
                        index={1}
                        backdropComponent={renderBackdrop}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                        backgroundStyle={{backgroundColor: useTheme()?.background?.get()}}>
        <H4 textAlign="center">
          Transaction Type
        </H4>
        <RadioGroup defaultValue="Expense" onPress={() => {

          bottomSheetModalRef?.current?.dismiss();

        }}>
          <XStack alignItems="center" margin="$2">
            <RadioGroup.Item value="Expense" size="$6" margin="$2">
              <RadioGroup.Indicator/>
            </RadioGroup.Item>
            <Label>
              Expense
            </Label>
          </XStack>
          <Separator/>
          <XStack alignItems="center" margin="$2">
            <RadioGroup.Item value="Income" size="$6" margin="$2">
              <RadioGroup.Indicator/>
            </RadioGroup.Item>
            <Label>
              Income
            </Label>
          </XStack>
        </RadioGroup>
      </BottomSheetModal>
    </YStack>
    </KeyboardAvoidingView>
  );
}