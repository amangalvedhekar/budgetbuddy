import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
export const History = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke="#1C274C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l2.5 2.5"
    />
    <Path
      fill="#1C274C"
      d="m5.604 5.604-.53-.53.53.53ZM4.338 6.871l-.75.003a.75.75 0 0 0 .746.747l.004-.75Zm2.542.762a.75.75 0 1 0 .007-1.5l-.007 1.5ZM5.075 4.321a.75.75 0 0 0-1.5.008l1.5-.008ZM3.75 12a.75.75 0 0 0-1.5 0h1.5Zm13.125 8.445a.75.75 0 1 0-.75-1.298l.75 1.298Zm2.272-4.32a.75.75 0 1 0 1.298.75l-1.298-.75ZM5.14 5.07a.75.75 0 1 0 1.056 1.066L5.14 5.071Zm13.722.067c-3.82-3.82-9.993-3.859-13.788-.064l1.06 1.06c3.2-3.199 8.423-3.18 11.668.065l1.06-1.061ZM5.074 5.074 3.808 6.34l1.06 1.06 1.267-1.265-1.061-1.061Zm-.74 2.547 2.546.012.007-1.5-2.545-.012-.008 1.5Zm.754-.754L5.075 4.32l-1.5.008.013 2.545 1.5-.007ZM12 3.75A8.25 8.25 0 0 1 20.25 12h1.5c0-5.385-4.365-9.75-9.75-9.75v1.5Zm0 16.5A8.25 8.25 0 0 1 3.75 12h-1.5c0 5.385 4.365 9.75 9.75 9.75v-1.5Zm4.125-1.103A8.209 8.209 0 0 1 12 20.25v1.5c1.775 0 3.44-.475 4.875-1.305l-.75-1.298ZM20.25 12a8.209 8.209 0 0 1-1.103 4.125l1.298.75A9.708 9.708 0 0 0 21.75 12h-1.5ZM6.196 6.137A8.221 8.221 0 0 1 12 3.75v-1.5a9.721 9.721 0 0 0-6.86 2.821l1.056 1.066Z"
    />
  </Svg>
);