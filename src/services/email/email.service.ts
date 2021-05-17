import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { EMAIL_TRANSPORTER } from '../../core/injectionTokens';

@Injectable()
export class EmailService {
  constructor(@Inject(EMAIL_TRANSPORTER) private transporter: Transporter) {}

  async sendInfoUserCreated(userEmail: string): Promise<void> {
    await this.transporter.sendMail({
      from: '<foo@example.com>',
      to: userEmail,
      subject: 'System info',
      text: `Hi, you have been registered at system`,
    });
  }

  async sendInfoPasswordChanged(
    userEmail: string,
    newPassword: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: '<foo@example.com>',
      to: userEmail,
      subject: 'System info',
      text: `Your password at system has been changed to ${newPassword}`,
    });
  }
}
