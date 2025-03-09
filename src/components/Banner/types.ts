import {ReactNode} from "react";
import type {LayoutChangeEvent} from "react-native";
import {CardProps} from "tamagui";

type OnLayout = ((event: LayoutChangeEvent) => void) | undefined


export interface BannerCardProps extends CardProps{
  icon: ReactNode;
  text: string;
  onLayout?: OnLayout;
  color: string;
  idx?: number;
}

export interface BannerListProps {
  data: Array<BannerCardProps>;
  style: Record<string, any>;
}

export interface BannerContainerProps {
  data: BannerCardProps[];

}

export interface BannerStyleProps {
  width: number;
  isOpen: boolean;
  colors: Record<string, string>;
}

export interface ExpandCollapseProps {
  onPress: () => void;
  style: Record<string, any>;
  isOpen: boolean;
}