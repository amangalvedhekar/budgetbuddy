import {Label, RadioGroup, XStack, YStack} from "tamagui";

export const TransactionTypeSelector = () => {
  return (
    <RadioGroup>
      <YStack>
        <XStack width={300} alignItems="center">
          <RadioGroup.Item value={0} id={'id'}>
            <RadioGroup.Indicator />
          </RadioGroup.Item>

          <Label>
          Test
          </Label>
        </XStack>
      </YStack>
    </RadioGroup>
  );
}