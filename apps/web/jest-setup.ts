import '@testing-library/jest-dom';
import 'jest-localstorage-mock';

import { setGlobalConfig } from '@storybook/testing-react';

const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
} as any;

setGlobalConfig(parameters);
