import {fireEvent, render, screen, waitFor,} from "@testing-library/react-native";
import {Registration} from "../src/screens";
import * as Auth from 'aws-amplify/auth';
import {renderWithProviders} from "./renderWithProvidersForScreen";

const mockedNavigate = jest.fn();

jest.mock('aws-amplify/auth');

describe('Registration', () => {
  beforeEach(() => {
    (Auth as jest.Mocked<typeof Auth>).getCurrentUser = jest.fn().mockResolvedValue({});
  });
  describe('Validation', () => {
    it('should render', async () => {
      renderWithProviders(<Registration/>);
      const headerTitle = await screen.findByText('Welcome to BudgetBuddy');
      expect(headerTitle).toBeDefined();
    });

    it('should display error if email is empty', async () => {
      renderWithProviders(<Registration/>);
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      const errorMessage = await screen.findByText('Email entered is invalid');
      expect(errorMessage).toBeDefined();
    });

    it('should display error if password is empty', async () => {
      renderWithProviders(<Registration/>)
      const emailInput = await screen.findByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'abc@def.com')
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      const errorMessage = await screen.findByText('Password entered is invalid');
      expect(errorMessage).toBeDefined();
    });

    it('should display error if registration fails', async () => {
      (Auth as jest.Mocked<typeof Auth>).signUp = jest.fn().mockRejectedValue({errorMessage: 'errr'});
      renderWithProviders(<Registration/>)
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
      renderWithProviders(<Registration/>,{values: {
          mockedNavigate
        }});
      const signIn = await screen.findByText('Already member? Sign In');
      fireEvent.press(signIn);
      expect(mockedNavigate).toHaveBeenCalledWith('SignIn',{showPasswordResetBanner: false});
    });

    it('should navigate to confirmation account if registration is successful', async () => {
      const mockedSignUp = jest.fn();
      const signupParams = {username: 'abc@yopm.com', password: 'Password1!'};
      (Auth as jest.Mocked<typeof Auth>).signUp = mockedSignUp.mockResolvedValue({});
      renderWithProviders(<Registration/>, {values: {
        mockedNavigate
        }});
      const emailInput = await screen.findByPlaceholderText('Email');
      fireEvent.changeText(emailInput, 'Abc@yopm.com');
      const passwordInput = await screen.findByPlaceholderText('Password');
      fireEvent.changeText(passwordInput, 'Password1!');
      const registerBtn = await screen.findByText('Register');
      fireEvent.press(registerBtn);
      await waitFor(() => {
        expect(mockedSignUp)
          .toHaveBeenCalledWith(signupParams);
        expect(mockedNavigate)
          .toHaveBeenCalledWith('Code', {username: 'abc@yopm.com', codeTrigger: 'confirmAccount'});
      })
    });
  });
})