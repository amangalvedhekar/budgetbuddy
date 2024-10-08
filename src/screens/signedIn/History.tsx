import {FlatList} from "react-native";
import {useTheme as navigationTheme} from "@react-navigation/native";
import {Card, H2, H4, Paragraph, Separator, useTheme, XStack, YStack} from "tamagui";

import {JSX, useCallback, useEffect, useMemo, useRef} from "react";
import {BottomSheetBackdrop, BottomSheetModal} from "@gorhom/bottom-sheet";
import {
  BottomSheetDefaultBackdropProps
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import {Filter} from "../../icons";

const transactionList = [
  {
    amount: 1234.330,
    description: 'Insanely big description, cant belive it is this long but it is this long and it just keeps growing',
    type: 'Expense',
  },
  {
    amount: 200988804.3,
    description: 'Dividend from VDY',
    type: 'Income',
  },
  {
    amount: 20.3,
    description: 'Dividend from VDY',
    type: 'Income',
  },
  {
    amount: 20.3,
    description: 'Dividend from VDY',
    type: 'Income',
  },
  {
    amount: 20.3,
    description: 'Dividend from VDY',
    type: 'Income',
  },
  {
    amount: 20.44,
    description: 'Subscription - Apple One',
    type: 'Expense',
  },
  {
    amount: 20.44,
    description: 'Subscription - Sportsnet',
    type: 'Expense',
  },
  {
    amount: 20.44,
    description: 'Subscription - Apple One',
    type: 'Expense',
  },
  {
    amount: 20.44,
    description: 'Very long description name, how will this look',
    type: 'Expense',
  },
  {
    amount: 20.44,
    description: 'Very long description name, how will this look',
    type: 'Expense',
  },
  {
    amount: 20.44,
    description: 'Very long description name, how will this look',
    type: 'Expense',
  },
  {
    amount: 365089.88,
    description: 'Very long description name, how will this look',
    type: 'Expense',
  },
];
// ToDo - Add types
const RenderItem = ({item, onPress}: any) => (
  <Card elevate
        margin="$2"
        borderRadius="$8"
        size="$3"
        animation="bouncy"
        scale={0.9}
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}
        onPress={onPress}
  >
    <Card.Header>
      <XStack justifyContent="space-between" flex={1} flexWrap="wrap">
        <H4 textWrap="wrap" flexWrap="wrap" flex={0.9}>{item.description}</H4>
        <Paragraph size="$8" color={item.type === 'Expense' ? 'red' : 'green'}>{new Intl.NumberFormat('en-CA', {
          style: 'currency',
          currency: 'CAD'
        }).format(item.amount)}</Paragraph>
      </XStack>
    </Card.Header>
  </Card>
);
export const History = ({navigation}: any) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['45%', '45%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    console.log('coming here')
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
  const {colors} = navigationTheme();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <Filter fill={colors.text} onPress={handlePresentModalPress}/>
    });
  }, [navigation, bottomSheetModalRef]);
  return (
    <>
      <Card
        margin="$2"
        padding="$2"
        size="$1"
        animation="bouncy"
        scale={0.9}
        hoverStyle={{scale: 0.975}}
        pressStyle={{scale: 0.975}}
      >
        <Card.Header>
          <XStack justifyContent="space-between">
            <H4 textWrap="wrap">
              Description
            </H4>
            <Paragraph size="$8">Amount</Paragraph>
          </XStack>
        </Card.Header>
      </Card>
      <FlatList data={transactionList} renderItem={({item}) => <RenderItem item={item} onPress={handlePresentModalPress}/>}/>
      <BottomSheetModal ref={bottomSheetModalRef} index={1}
                        backdropComponent={renderBackdrop}
                        snapPoints={snapPoints}
                        onChange={handleSheetChanges}
                        backgroundStyle={{backgroundColor: useTheme()?.background?.get()}}>
       <H2 textAlign="center">Details</H2>
        <YStack marginHorizontal="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <H4 textWrap="wrap">
            Date
          </H4>
          <Paragraph size="$8">August 11, 2024</Paragraph>
        </XStack>
        <Separator minBlockSize="$2"/>
        <XStack justifyContent="space-between">
          <H4 textWrap="wrap">
            Added by
          </H4>
          <Paragraph size="$8" textWrap="wrap">amangalvedhekar@icloud.com</Paragraph>
        </XStack>
        <Separator minBlockSize="$2"/>
        <XStack justifyContent="space-between">
          <H4 textWrap="wrap">
           Type
          </H4>
          <Paragraph size="$8">Dividend</Paragraph>
        </XStack>
        </YStack>
      </BottomSheetModal>
    </>
  );
}