import {Button} from "tamagui";
import {ChevronDown, ChevronUp} from "../../icons";
import {useTheme} from "@react-navigation/native";
import {ExpandCollapseProps} from "./types";

export const ExpandCollapse = ({onPress, style, isOpen}:ExpandCollapseProps) => {
  const {colors} = useTheme();
  return (
    <Button
      onPress={onPress}
      style={style}
    >
      {
        isOpen ?
          <ChevronDown
            width={32}
            height={32}
            color={colors.text}
          />
          :
          <ChevronUp
            width={32}
            height={32}
            color={colors.text}
          />
      }
    </Button>
  );
}