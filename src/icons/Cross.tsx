import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
export const Cross = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M16 30C8.268 30 2 23.73 2 16S8.268 2 16 2s14 6.27 14 14-6.268 14-14 14Zm0-30C7.163 0 0 7.16 0 16s7.163 16 16 16 16-7.16 16-16S24.837 0 16 0Zm5.717 10.28a1.014 1.014 0 0 0-1.425 0l-4.298 4.3-4.236-4.24a1 1 0 0 0-1.414 0 1.006 1.006 0 0 0 0 1.42l4.236 4.23-4.266 4.27a1.015 1.015 0 0 0 0 1.43c.394.39 1.032.39 1.426 0l4.266-4.27 4.236 4.24a1.002 1.002 0 1 0 1.415-1.42l-4.237-4.23 4.297-4.3c.393-.4.393-1.03 0-1.43Z"
    />
  </Svg>
);
