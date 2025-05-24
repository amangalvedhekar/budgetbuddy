import {TamaguiProvider} from "tamagui";
import {config} from "../../tamagui.config";
import {useSelector} from "react-redux";

export const ThemeProvider = ({children}) => {
  const user = useSelector((state)=> state.user);
console.log(user.appearance, 'appearance for user')
  return (
    <TamaguiProvider config={config} defaultTheme={user.appearance}>
      {user?.appearance == undefined ? <></>: children}
    </TamaguiProvider>
  );
}