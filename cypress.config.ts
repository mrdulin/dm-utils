import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 3000,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'tests/**/*.cy.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: false,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
