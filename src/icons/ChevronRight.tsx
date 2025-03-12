import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const ChevronRight = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path  d="M0 0h24v24H0z" />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m9.5 7 5 5-5 5"
    />
  </Svg>
);
