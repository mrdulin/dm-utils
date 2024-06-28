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
});
