import { defineConfig } from 'cypress';
import { rmdir } from 'fs';
import readXlsxFile from 'read-excel-file/node';

export default defineConfig({
  defaultCommandTimeout: 3000,

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'tests/**/*.cy.{js,jsx,ts,tsx}',
    screenshotOnRunFailure: false,
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
    },
  },

  e2e: {
    baseUrl: 'http://localhost:64055',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      on('task', {
        readExcelFile(filename) {
          // we must read the Excel file using Node library
          // and can return the parsed list to the browser
          // for the spec code to validate it
          console.log('reading Excel file %s', filename);
          console.log('from cwd %s', process.cwd());

          return readXlsxFile(filename);
        },

        deleteFolder(folderName) {
          console.log('deleting folder %s', folderName);

          return new Promise((resolve, reject) => {
            rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
              if (err) {
                console.error(err);
                return reject(err);
              }
              resolve(null);
            });
          });
        },
      });
    },
  },
});
