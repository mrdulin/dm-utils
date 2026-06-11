import { file } from '../src';

describe('file', () => {
  describe('getFilenameFromContentDispositionHeader', () => {
    it('should return the filename if there is only one', async () => {
      const header = {
        'content-disposition': 'attachment;filename=%E5%A4%A7%E8%A1%8C%E6%8C%87%E5%AF%BC2024-06-27-2024-06-28.xlsx',
      };
      const result = file.getFilenameFromContentDispositionHeader(header);
      expect(result).to.be.equal('大行指导2024-06-27-2024-06-28.xlsx');
    });

    it('should return the filename if there are multiple', async () => {
      const header = {
        'content-disposition': "attachment; filename=document.pdf; filename*=UTF-8''document.pdf",
      };
      const result = file.getFilenameFromContentDispositionHeader(header);
      expect(result).to.be.equal('document.pdf');
    });
  });

  describe('downloadByXHR', () => {
    function setupDownloadByXHRTest() {
      cy.clock();
      return cy.then(() => {
        const response = new Blob(['file content'], { type: 'text/plain' });
        const originalCreateElement = document.createElement.bind(document);
        let anchor: HTMLAnchorElement | undefined;
        const xhrOpen = cy.stub();
        const xhrSend = cy.stub().callsFake(() => {
          request.response = response;
          request.onload?.();
        });
        const request = {
          open: xhrOpen,
          send: xhrSend,
          responseType: '',
          response,
          onload: undefined as (() => void) | undefined,
        };

        cy.wrap(xhrOpen, { log: false }).as('xhrOpen');
        cy.wrap(xhrSend, { log: false }).as('xhrSend');
        cy.stub(window, 'XMLHttpRequest').callsFake(() => request as unknown as XMLHttpRequest);
        const createObjectURL = cy.stub(URL, 'createObjectURL').returns('blob:mock-url');
        const revokeObjectURL = cy.stub(URL, 'revokeObjectURL');
        cy.wrap(createObjectURL, { log: false }).as('createObjectURL');
        cy.wrap(revokeObjectURL, { log: false }).as('revokeObjectURL');
        cy.stub(document, 'createElement').callsFake(((tagName: string, options?: ElementCreationOptions) => {
          const element = originalCreateElement(tagName, options);
          if (tagName === 'a') {
            anchor = element as HTMLAnchorElement;
            const anchorClick = cy.stub(anchor, 'click');
            cy.wrap(anchorClick, { log: false }).as('anchorClick');
          }
          return element;
        }) as typeof document.createElement);

        return cy.wrap({ anchor: () => anchor, request }, { log: false });
      });
    }

    it('should set download attribute and click anchor when target is omitted', () => {
      setupDownloadByXHRTest().then(({ anchor, request }) => {
        file.downloadByXHR('/people.xlsx', 'people.xlsx');

        cy.get('@xhrOpen').should('have.been.calledOnceWithExactly', 'GET', '/people.xlsx', true);
        cy.get('@xhrSend').should('have.been.calledOnce');
        cy.get('@createObjectURL').should('have.been.calledOnce');
        cy.get('@anchorClick').should('have.been.calledOnce');
        expect(request.responseType).to.equal('blob');

        const link = anchor();
        expect(link, 'created anchor').to.not.be.undefined;
        if (!link) throw new Error('anchor was not created');
        expect(link!.href).to.equal('blob:mock-url');
        expect(link!.download).to.equal('people.xlsx');
        expect(link!.target).to.equal('');

        cy.tick(4e4);
        cy.get('@revokeObjectURL').should('have.been.calledOnceWithExactly', 'blob:mock-url');
      });
    });

    it('should set target and skip download attribute when target is valid', () => {
      setupDownloadByXHRTest().then(({ anchor }) => {
        file.downloadByXHR('/people.xlsx', 'people.xlsx', '_blank');

        cy.get('@anchorClick').should('have.been.calledOnce');

        const link = anchor();
        expect(link, 'created anchor').to.not.be.undefined;
        if (!link) throw new Error('anchor was not created');
        expect(link!.href).to.equal('blob:mock-url');
        expect(link!.target).to.equal('_blank');
        expect(link!.download).to.equal('');
      });
    });
  });
});
