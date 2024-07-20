import {fireEvent, render, screen, waitFor} from "@testing-library/react-native";
import {AuthProvider} from "../src/contexts";
import {Registration} from "../src/screens/signedout/Registration";
import {TamaguiProvider} from "tamagui";
import {config} from "../tamagui.config";
import * as Auth from 'aws-amplify/auth';
const mockedNavigate = jest.fn();
const mockedGetCurrentUser = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockedNavigate
  }),
}));
jest.mock('aws-amplify/auth');

describe('Registration', () => {
  beforeEach(() => {
    // mockedGetCurrentUser.mockResolvedValue({});
    (Auth as jest.Mocked<any>).getCurrentUser = jest.fn().mockResolvedValue({});
  })
  describe('Validation', () => {
    it('should render',  async () => {
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      const headerTitle = await screen.findByText('Welcome to BudgetBuddy');
      expect(headerTitle).toBeDefined();
    });
    it('should display error if email is empty', async () => {
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      // const emailInput = await screen.findByPlaceholderText('Email');
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      const errorMessage = await screen.findByText('Email entered is invalid');
      expect(errorMessage).toBeDefined();
    });
    it('should display error if password is empty', async () => {
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      const emailInput = await screen.findByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'abc@def.com')
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      const errorMessage = await screen.findByText('Password entered is invalid');
      expect(errorMessage).toBeDefined();
    });
    it('should display error if registration fails', async () => {
      (Auth as jest.Mocked<any>).signUp = jest.fn().mockRejectedValue({errorMessage: 'errr'});
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      const emailInput = await screen.findByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'abc@def.com');
      const passwordInput = await screen.findByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'Password1!');
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      const errorMessage = await screen.findByText('Email/Password incorrect. Try again!');
      expect(errorMessage).toBeDefined();
    });
  });
  describe('Navigation', () => {
    it('should navigate to sign in screen', async () => {
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      const signIn = await screen.findByText('Already member? Sign In');
      fireEvent.press(signIn);
      expect(mockedNavigate).toHaveBeenCalledWith('SignIn');
    });

    it('should navigate to confirmation account if registration is successful', async () => {
      const mockedSignUp = jest.fn();
      (Auth as jest.Mocked<any>).signUp = mockedSignUp.mockResolvedValue({});
      render(<AuthProvider>
        <TamaguiProvider config={config}>
          <Registration />
        </TamaguiProvider>
      </AuthProvider>);
      const emailInput = await screen.findByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'Abc@yopm.com');
      const passwordInput = await screen.findByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'Password1!');
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      await waitFor(() => {
        expect(mockedSignUp).toHaveBeenCalledWith({username: 'abc@yopm.com', password: 'Password1!'});
        expect(mockedNavigate).toHaveBeenCalledWith('Code', {username: 'abc@yopm.com'});
      })
    });
  });
})