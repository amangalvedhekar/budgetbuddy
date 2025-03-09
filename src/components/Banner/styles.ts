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
  box1: {
    top: 10,
    left: 0,
  },
  box2: {
    top: 30,
    left: 0,
  },
  box3: {
    top: 50,
    left: 0,
  },
  expandCollapse: {
    flex:1,
    flexDirection: 'row',
    position: 'absolute',
    top: 4,
    zIndex:9,
    right: 8,
    borderRadius: 32,
    backgroundColor: colors.border,
    borderColor: colors.border,
  }
});
