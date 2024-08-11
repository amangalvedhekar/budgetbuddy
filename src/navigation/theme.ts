import type {Theme} from "@react-navigation/native/src/types";

export const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(160, 32, 240)',
    background: 'rgb(50,50,50)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 69, 58)',
  },
};


export const DefaultTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(160, 32, 240)',
    background: 'rgb(232,230,230)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};
