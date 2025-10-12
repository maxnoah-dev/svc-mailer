import { Router, Request, Response } from 'express';
import EmailService from '../services/email.service';
import { validateBody } from '../middleware/validation';
import { sendEmailSchema } from '../types/email.types';

const router = Router();
const emailService = new EmailService();

// POST /api/email/send
router.post('/send', validateBody(sendEmailSchema), async (req: Request, res: Response) => {
  try {
    const result = await emailService.sendEmail(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/email/recent
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const emails = await emailService.getRecentEmails(limit);
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching recent emails:', error);
    res.status(500).json({
      error: 'Failed to fetch recent emails',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/email/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const email = await emailService.getEmailById(id);
    
    if (!email) {
      return res.status(404).json({
        error: 'Email not found',
      });
    }
    
    res.status(200).json(email);
  } catch (error) {
    console.error('Error fetching email:', error);
    res.status(500).json({
      error: 'Failed to fetch email',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
