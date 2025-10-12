import * as nodemailer from 'nodemailer';
import PrismaService from './prisma.service';
import { SendEmailDto, EmailResponseDto } from '../types/email.types';

class EmailService {
  private transporter: nodemailer.Transporter;
  private prisma: PrismaService;

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
    const email = await this.prisma.prisma.email.create({
      data: {
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: sendEmailDto.html,
        templateID: sendEmailDto.templateID,
        vars: sendEmailDto.vars,
        status: 'queued',
      },
    });

    try {
      await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || 'noreply@example.com',
        to: sendEmailDto.to,
        subject: sendEmailDto.subject,
        html: sendEmailDto.html,
      });

      // Update status to sent
      await this.prisma.prisma.email.update({
        where: { id: email.id },
        data: { status: 'sent' },
      });

      return {
        id: email.id,
        status: 'sent',
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Update status to failed
      await this.prisma.prisma.email.update({
        where: { id: email.id },
        data: { 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
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
