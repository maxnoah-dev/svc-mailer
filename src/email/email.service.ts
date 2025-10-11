import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailResponseDto } from './dto/email-response.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private prisma: PrismaService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: parseInt(process.env.SMTP_PORT || '1025'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })
    }

    async sendEmail(sendEmailDto: SendEmailDto): Promise<EmailResponseDto> {
        const email = await this.prisma.email.create({
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
            
            return {
                id: email.id,
                status: 'queued',
            }
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /*
        this.prisma.email.findMany(): Tìm nhiều record trong bảng email
        take: limit: Giới hạn số lượng record trả về
        orderBy: { createdAt: 'desc' }: Sắp xếp theo thời gian tạo, mới nhất trước
    */
    async getRecentEmails(limit: number = 10) {
        return this.prisma.email.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
}