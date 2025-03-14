import { Inject, Injectable } from '@nestjs/common';
import { ServerClient } from 'postmark';

@Injectable()
export class PostmarkService {
  private client: ServerClient;
  private fromEmail: string;

  constructor(
    @Inject('POSTMARK_OPTIONS') private options: { apiKey: string; fromEmail: string },
  ) {
    this.client = new ServerClient(options.apiKey);
    this.fromEmail = options.fromEmail;
  }

  async sendEmail(to: string, subject: string, text: string) {
    return this.client.sendEmail({
      From: this.fromEmail,
      To: to,
      Subject: subject,
      TextBody: text,
    });
  }
}
