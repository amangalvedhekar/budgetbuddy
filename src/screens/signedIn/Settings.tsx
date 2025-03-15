import {H5, H4,Label, RadioGroup, ScrollView, Separator, XStack, YStack} from "tamagui";

export const Settings = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
      <H4 marginHorizontal="$5" marginVertical="$4">
        Currency
      </H4>
      <H5 marginHorizontal="$5">
        Which currency should be used for display? Currently, currency conversion is not supported, but it will be available soon.
      </H5>
      <RadioGroup>
        <YStack>
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              CAD - (CA$)
            </Label>
            <RadioGroup.Item value={"1"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              USD - (US$)
            </Label>
            <RadioGroup.Item value={"2"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
          <Separator />
        </YStack>
      </RadioGroup>
      <H4 marginHorizontal="$5" marginVertical="$4">
        Appearance
      </H4>
      <H5 marginHorizontal="$5">
        Choose a theme to view the app in, or continue with your device settings!
      </H5>
      <RadioGroup>
        <YStack>
        <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
          <Label size="$6">
            Use my device settings
          </Label>
          <RadioGroup.Item value={"1"} size="$6">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              Dark
            </Label>
            <RadioGroup.Item value={"2"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              Light
            </Label>
            <RadioGroup.Item value={"3"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
        </YStack>
      </RadioGroup>

      <Separator minBlockSize="$2" />

      <H4 marginHorizontal="$5" marginVertical="$4">
        Haptics
      </H4>
      <H5 marginHorizontal="$5">
        Haptics are feedback in form of vibrations! They make interactions more realistic.
      </H5>
      <RadioGroup>
        <YStack>
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              Use my device settings
            </Label>
            <RadioGroup.Item value={"1"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
          <Separator />
          <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
            <Label size="$6">
              Turn off for BudgetGenie
            </Label>
            <RadioGroup.Item value={"2"} size="$6">
              <RadioGroup.Indicator />
            </RadioGroup.Item>
          </XStack>
          <Separator />
        </YStack>
      </RadioGroup>
    </ScrollView>
  );
}