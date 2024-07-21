import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const Account = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 128 128"
    {...props}
  >
    <Path
      d="M30 49c0 18.7 15.3 34 34 34s34-15.3 34-34-15.3-34-34-34-34 15.3-34 34zm60 0c0 14.3-11.7 26-26 26S38 63.3 38 49s11.7-26 26-26 26 11.7 26 26zM24.4 119.4C35 108.8 49 103 64 103s29 5.8 39.6 16.4l5.7-5.7C97.2 101.7 81.1 95 64 95s-33.2 6.7-45.3 18.7l5.7 5.7z"
    />
  </Svg>
);
