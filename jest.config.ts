/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./setupTests.ts'],
  testPathIgnorePatterns: ['renderWithProvidersForScreen.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)/expo-modules-core|aws-amplify/.*|aws-amplify|@aws-amplify/react-native'
  ],
  // moduleDirectories: [],
  // moduleNameMapper: {
  //   'aws-amplify': '<rootDir>/node_modules/aws-amplify',
  //   'aws-amplify/auth': '<rootDir>/node_modules/aws-amplify/auth',
  //   '@aws-amplify/react-native':
  //     '<rootDir>/node_modules/@aws-amplify/react-native',
  // }
};

export default config;
