import * as Auth from 'aws-amplify/auth';
import {renderWithProviders} from "./renderWithProvidersForScreen";
import {ForgotPassword} from "../src/screens/signedout/ForgotPassword";
import {screen, userEvent, waitFor} from "@testing-library/react-native";

jest.mock('aws-amplify/auth');

describe('Forgot Password', () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    (Auth as jest.Mocked<typeof Auth>).getCurrentUser = jest.fn().mockResolvedValue({});
  });

  describe('Validation', () => {
    it('display error message when validation fails', async() => {
      const user = userEvent.setup();
      renderWithProviders(<ForgotPassword />);
      const header = await screen.findByText('Reset your password')
      expect(header).toBeOnTheScreen();
      await user.type(screen.getByPlaceholderText('Email'), 'acc');
      await user.press(screen.getByRole('text', {name: 'Continue'}));
      expect(screen.getByRole('text',{name: 'Email entered is invalid'}));
    });
    it('removes error message when input changes', async () => {
      const user = userEvent.setup();
      renderWithProviders(<ForgotPassword />, {values: {mockedNavigate}});
      const header = await screen.findByText('Reset your password')
      expect(header).toBeOnTheScreen();
      await user.type(screen.getByPlaceholderText('Email'), 'acc');
      await user.press(screen.getByRole('text', {name: 'Continue'}));
      expect(screen.getByRole('text',{name: 'Email entered is invalid'}));
      await user.type(screen.getByPlaceholderText('Email'), 'acc@bcd.com');

        expect(screen.queryByRole('text', {name: 'Email entered is invalid'})).not.toBeOnTheScreen();
    });
  });
  describe('Navigation', () => {
    it.todo('navigates to code screen when email input is valid');
  });
});