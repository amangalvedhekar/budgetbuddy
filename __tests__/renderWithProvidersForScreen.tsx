import {render} from "@testing-library/react-native";
import {TamaguiProvider} from "tamagui";
import {config} from "../tamagui.config";
import {AuthProvider} from "../src/contexts";
import {ReactElement} from "react";
import {NavigationContext, useNavigation} from "@react-navigation/native";

interface RenderWithProvidersProps {
  values: {
    mockedNavigate?: jest.MockedFunction<typeof useNavigation>;
    mockedDispatch?: jest.MockedFunction<any>;
    mockedGoBack?: jest.MockedFunction<any>;
    mockedCanGoBack?: boolean;
  }
}

export function renderWithProviders<T>(
  ui: ReactElement<T>,
  options?: RenderWithProvidersProps
) {
  const actualNav = jest.requireActual('@react-navigation/native');
  const navContext = {
    ...actualNav.navigation,
    useNavigation: () => ({
      navigate: options?.values?.mockedNavigate,
    }),
    dangerouslyGetState: () => {
    },
    setOptions: () => {
    },
    addListener: () => () => {
    },
    isFocused: () => true,
    navigate: options?.values?.mockedNavigate,
    dispatch: options?.values?.mockedDispatch,
    setParams: jest.fn(),
    canGoBack: () => options?.values?.mockedCanGoBack ?? true,
    goBack: options?.values?.mockedGoBack,
  };
  return render(
    <AuthProvider>
      <TamaguiProvider config={config}>
        <NavigationContext.Provider value={navContext}>
          {ui}
        </NavigationContext.Provider>
      </TamaguiProvider>
    </AuthProvider>
  );
}