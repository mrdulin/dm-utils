import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 3000,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
