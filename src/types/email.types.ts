import { z } from 'zod';

export const sendEmailSchema = z.object({
  to: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().optional(),
  templateID: z.string().optional(),
  vars: z.record(z.string(), z.any()).optional(),
});

export type SendEmailDto = z.infer<typeof sendEmailSchema>;

export interface EmailResponseDto {
  id: string;
  status: string;
}
