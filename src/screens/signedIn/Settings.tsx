import {H5, H4, Label, RadioGroup, ScrollView, Separator, XStack, YStack} from "tamagui";
import {Fragment} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useColorScheme} from "react-native";
import {updateUser} from "../../dbOperations/user";

const appearance = [
  {
    label: 'Use my device settings',
    value: 'deviceSettings',
  },
  {
    label: 'Dark',
    value: 'dark',
  },
  {
    label: 'Light',
    value: 'light',
  }
];
export const Settings = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  console.log(user, 'user is')
  const handleChange = async (x) => {
    if (x == 'deviceSettings') {
      await updateUser({
        userId: user.userId, dispatch, data: {
          appearance: scheme,
          appearanceSettings: x,
        }
      });
    } else {
      await updateUser({
        userId: user.userId, dispatch, data: {
          appearanceSettings: x,
          appearance: x,
        }
      });
    }

  }
  return (
    <ScrollView contentContainerStyle={{paddingBottom: 50}}>

      <H4 marginHorizontal="$5" marginVertical="$4">
        Appearance
      </H4>
      <H5 marginHorizontal="$5">
        Choose a theme to view the app in, or continue with your device settings!
      </H5>
      <RadioGroup onValueChange={handleChange} defaultValue={user.appearanceSettings}>
        <YStack>
          {appearance.map((item, idx) => (
            <Fragment key={item.value}>
              <XStack alignItems="center" justifyContent="space-between" marginHorizontal="$5">
                <Label size="$6">
                  {item.label}
                </Label>
                <RadioGroup.Item value={item.value} size="$6">
                  <RadioGroup.Indicator/>
                </RadioGroup.Item>
              </XStack>
              {idx !== appearance.length - 1 && <Separator/>}
            </Fragment>
          ))}

        </YStack>
      </RadioGroup>


    </ScrollView>
  );
}