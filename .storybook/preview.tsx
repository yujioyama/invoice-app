import type { Preview } from '@storybook/nextjs-vite';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#f7f8fa' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;