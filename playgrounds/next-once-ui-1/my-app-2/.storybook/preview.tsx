import type { Preview } from '@storybook/nextjs-vite'
import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '../src/resources/custom.css';
import { Providers } from '../src/components/Providers';

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
      </Providers>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;