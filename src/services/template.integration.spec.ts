import templateService from './template.service';
import * as fs from 'fs';
import * as path from 'path';

describe('TemplateService Integration', () => {
  it('should render welcome template with real file', async () => {
    // Kiểm tra xem file welcome.hbs có tồn tại không
    const templatePath = path.join(__dirname, '../../templates/welcome.hbs');
    
    if (fs.existsSync(templatePath)) {
      const result = await templateService.renderTemplate('welcome', {
        name: 'John',
        company: 'ABC Corp',
        message: 'Welcome!'
      });
      
      expect(result).toContain('John');
      expect(result).toContain('ABC Corp');
      expect(result).toContain('Welcome!');
    } else {
      console.log('Template file not found, skipping test');
    }
  });
});