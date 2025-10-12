import templateService from './template.service';

describe('TemplateService', () => {
  describe('renderTemplate', () => {
    it('should throw error for non-existent template', async () => {
      await expect(templateService.renderTemplate('nonexistent', {}))
        .rejects.toThrow('Template nonexistent not found');
    });
  });
});