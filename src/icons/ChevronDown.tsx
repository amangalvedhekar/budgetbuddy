import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const ChevronDown = (props: SvgProps) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >

    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m17 9.5-5 5-5-5"
    />
  </Svg>
);
