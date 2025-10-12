import { sendEmailSchema } from './email.types';

describe('Email Types Validation', () => {
  describe('sendEmailSchema', () => {
    it('should validate valid email data with html', () => {
      const validData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>'
      };
      
      const result = sendEmailSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate valid email data with template', () => {
      const validData = {
        to: 'test@example.com',
        subject: 'Test Subject',
        templateID: 'welcome',
        vars: { name: 'John', company: 'ABC Corp' }
      };
      
      const result = sendEmailSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email address', () => {
      const invalidData = {
        to: 'invalid-email',
        subject: 'Test Subject'
      };
      
      const result = sendEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should require subject', () => {
      const invalidData = {
        to: 'test@example.com',
        subject: ''
      };
      
      const result = sendEmailSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should accept empty html and templateID', () => {
      const validData = {
        to: 'test@example.com',
        subject: 'Test Subject'
      };
      
      const result = sendEmailSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});