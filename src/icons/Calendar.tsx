import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const CalendarIcon = (props: SvgProps) => (
  <Svg width={32} height={32} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      stroke={props.stroke}
      strokeLinecap="round"
      strokeWidth={2}
      d="M3 9h18M7 3v2m10-2v2M6 12h2m3 0h2m3 0h2M6 15h2m3 0h2m3 0h2M6 18h2m3 0h2m3 0h2M6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 6.52 3 7.08 3 8.2v9.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21Z"
    />
  </Svg>
);