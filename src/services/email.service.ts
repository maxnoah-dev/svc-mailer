import * as nodemailer from 'nodemailer';
import PrismaService from './prisma.service';
import { SendEmailDto, EmailResponseDto } from '../types/email.types';
import templateService from './template.service';

class EmailService {
  private transporter: nodemailer.Transporter;
  private prisma: PrismaService;
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.prisma = PrismaService.getInstance();
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(sendEmailDto: SendEmailDto): Promise<EmailResponseDto> {
    let htmlContent = sendEmailDto.html;

    if (sendEmailDto.templateID && sendEmailDto.vars) {
      try {
        htmlContent = await templateService.renderTemplate(
          sendEmailDto.templateID,
          sendEmailDto.vars
        )
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(`Template rendering failed: ${msg}`);
      }
    }
    const email = await this.prisma.prisma.email.create({
      data: {
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: htmlContent,
        templateID: sendEmailDto.templateID,
        vars: sendEmailDto.vars,
        status: 'queued',
      },
    });

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempting to send email (attempt ${attempt}/${this.MAX_RETRIES})`);

        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@example.com',
          to: sendEmailDto.to,
          subject: sendEmailDto.subject,
          html: sendEmailDto.html,
        });

        await this.prisma.prisma.email.update({
          where: { id: email.id },
          data: { status: 'sent' },
        });

        return { id: email.id, status: 'sent' };
      } catch (error) {
        lastError = error as Error;
        console.error(`Email sending attempt ${attempt} failed:`, error);

        if (attempt < this.MAX_RETRIES) {
          const deplay = Math.pow(2, attempt) * 1000;
          console.log(`Waiting ${deplay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, deplay));
        }
      }
    }

    await this.prisma.prisma.email.update({
      where: { id: email.id },
      data: {
        status: 'failed',
        error: lastError?.message || 'Unknow error after 3 retries',
      },
    });

    throw lastError;
  }

  async getRecentEmails(limit: number = 10) {
    return this.prisma.prisma.email.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getEmailById(id: string) {
    return this.prisma.prisma.email.findUnique({
      where: { id },
    });
  }
}

export default EmailService;
