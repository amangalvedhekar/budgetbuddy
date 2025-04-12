import * as React from "react"
import Svg, {SvgProps, Path} from "react-native-svg"
import { XStack, YStack, Circle} from "tamagui";
import {StyleSheet} from "react-native";
export const Filter = ({fill = 'purple',height=24,width=24,...rest}: SvgProps) => (
  <YStack>
    <XStack style={{...StyleSheet.absoluteFillObject, left:26}}>
      {rest.showAppliedFilter && <Circle backgroundColor="green" size={12}/>}
    </XStack>
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...rest}
  >
    <Path
      stroke={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7h16M7 12h10M11 17h2"
    />
  </Svg>
  </YStack>
);
