import path from 'path';

export const validateExcelFile = () => {
  const downloadsFolder = Cypress.config('downloadsFolder');
  const downloadedFilename = path.join(downloadsFolder, 'people.xlsx');

  // ensure the file has been saved before trying to parse it
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should((buffer) => {
    // by having length assertion we ensure the file has text
    // since we don't know when the browser finishes writing it to disk

    // Tip: use expect() form to avoid dumping binary contents
    // of the buffer into the Command Log
    expect(buffer.length).to.be.gt(100);
  });

  cy.log('**the file exists**');

  // the first utility library we use to parse Excel files
  // only works in Node, thus we can read and parse
  // the downloaded file using cy.task
  cy.task('readExcelFile', downloadedFilename)
    // returns an array of lines read from Excel file
    .should('have.length', 4)
    .then((list) => {
      expect(list[0], 'header line').to.deep.equal(['First name', 'Last name', 'Occupation', 'Age', 'City', 'State']);

      expect(list[1], 'first person').to.deep.equal(['Joe', 'Smith', 'student', 20, 'Boston', 'MA']);
    });
};

describe('file download', () => {
  beforeEach(() => {
    const downloadsFolder = Cypress.config('downloadsFolder');
    cy.task('deleteFolder', downloadsFolder);
  });

  context('from remote domain localhost:64055', { browser: '!firefox' }, () => {
    it('CSV file', () => {
      cy.visit('/');
      cy.get('[data-cy=download-remote-xlsx]').click();

      cy.log('**confirm downloaded file**');

      validateExcelFile();
    });
  });
});
