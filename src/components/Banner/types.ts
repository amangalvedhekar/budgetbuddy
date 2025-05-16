import {ReactNode} from "react";
import type {LayoutChangeEvent} from "react-native";
import {CardProps} from "tamagui";
import {CardWithProgress} from "../CardWithProgress";

type OnLayout = ((event: LayoutChangeEvent) => void) | undefined

export interface CardWithProgressProps {
  headingTitle: string;
  actualSpent: number;
  budgetedAmount: number;
}

export interface BannerCardProps extends CardProps, CardWithProgressProps{
  icon: ReactNode;
  text: string;
  onLayout?: OnLayout;
  color: string;
  idx?: number;
  isOpen?: boolean;
}

export interface BannerListProps {
  data: Array<BannerCardProps>;
  style: Record<string, any>;
  isOpen: boolean;
}

export interface BannerContainerProps {
  data: BannerCardProps[];
  titleHeader?: string;

}

export interface BannerStyleProps {
  width: number;
  isOpen: boolean;
  colors: Record<string, string>;
}

export interface ExpandCollapseProps {
  onPress: () => void;
  style?: Record<string, any>;
  isOpen: boolean;
}