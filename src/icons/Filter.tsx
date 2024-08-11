import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const Filter = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7h16M7 12h10M11 17h2"
    />
  </Svg>
);
