import '@testing-library/react-native/extend-expect';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@aws-amplify/react-native', () => ({
  loadBase64: jest.fn().mockImplementation(() => ({
    encode: jest.fn(),
  })),
  loadGetRandomValues: jest.fn(),
  loadUrlPolyfill: jest.fn(),
  loadAsyncStorage: jest.fn(),
  loadAppState: jest.fn(() => ({
    addEventListener: jest.fn(),
  })),
}));

