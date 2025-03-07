import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const ChevronUp = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m18 15-5.787-5.787v0a.3.3 0 0 0-.426 0v0L6 15"
    />
  </Svg>
)