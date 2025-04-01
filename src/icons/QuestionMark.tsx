import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"
export const QuestionMark = ({color = 'purple', ...rest}: SvgProps) => (
  <Svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...rest}>
    <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={1.5} />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeWidth={1.5}
      d="M10.125 8.875a1.875 1.875 0 1 1 2.828 1.615c-.475.281-.953.708-.953 1.26V13"
    />
    <Circle cx={12} cy={16} r={1} stroke={color} />
  </Svg>
);