import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Create a Nodemailer transporter using Gmail
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Your Gmail password or app-specific password
      },
    });
  }

  async sendVerificationEmail(to: string, code: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER, // Sender address
        to, // Recipient address
        subject: 'Email Verification', // Subject line
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      };
      // Send the email
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
}
