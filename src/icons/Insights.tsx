import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const Insights = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    {...props}
    fill="none"
  >
    <Path
      stroke={props.fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 22h18"
    />
    <Path
      stroke={props.fill}
      strokeWidth={1.5}
      d="M3 11c0-.943 0-1.414.293-1.707C3.586 9 4.057 9 5 9c.943 0 1.414 0 1.707.293C7 9.586 7 10.057 7 11v6c0 .943 0 1.414-.293 1.707C6.414 19 5.943 19 5 19c-.943 0-1.414 0-1.707-.293C3 18.414 3 17.943 3 17v-6ZM10 7c0-.943 0-1.414.293-1.707C10.586 5 11.057 5 12 5c.943 0 1.414 0 1.707.293C14 5.586 14 6.057 14 7v10c0 .943 0 1.414-.293 1.707C13.414 19 12.943 19 12 19c-.943 0-1.414 0-1.707-.293C10 18.414 10 17.943 10 17V7ZM17 4c0-.943 0-1.414.293-1.707C17.586 2 18.057 2 19 2c.943 0 1.414 0 1.707.293C21 2.586 21 3.057 21 4v13c0 .943 0 1.414-.293 1.707C20.414 19 19.943 19 19 19c-.943 0-1.414 0-1.707-.293C17 18.414 17 17.943 17 17V4Z"
    />
  </Svg>
);
