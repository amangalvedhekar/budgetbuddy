import {StyleSheet} from "react-native";
import {BannerStyleProps} from "./types";

export const createStylesForBanner = ({width, isOpen, colors}: BannerStyleProps) => StyleSheet.create({
  container: {
    flex: 1,

  },
  box: {
    width: width - 16,
    position: isOpen ? 'absolute' : undefined,
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  expandCollapse: {
    // flex:1,
    // flexDirection: 'row',
    // position: 'absolute',
    // top: 4,
    // zIndex:9,
    // right: 8,
    borderRadius: 16,
    backgroundColor: colors.border,
    borderColor: colors.border,
  }
});
