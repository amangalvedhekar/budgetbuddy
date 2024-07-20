import {render, screen} from "@testing-library/react-native";
import {AuthProvider} from "../src/contexts";
import {Registration} from "../src/screens/signedout/Registration";
import {TamaguiProvider} from "tamagui";
import {config} from "../tamagui.config";
const mockedNavigate = jest.fn();
const mockedGetCurrentUser = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate
  }),
}));
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: mockedGetCurrentUser
}));

describe('Registration', () => {
  mockedGetCurrentUser.mockResolvedValue({})
  it('should render',  async () => {
    render(<AuthProvider>
      <TamaguiProvider config={config}>
      <Registration />
      </TamaguiProvider>
    </AuthProvider>);
    const headerTitle = await screen.findByText('Welcome to BudgetBuddy');
    expect(headerTitle).toBeDefined();
  });
  it.todo('should display error if email is empty');
  it.todo('should display error if password is empty');
  it.todo('should display error if registration fails');
})