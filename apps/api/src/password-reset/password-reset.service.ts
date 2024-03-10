import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { ServerClient } from 'postmark';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordResetService {
  constructor(private readonly prisma: PrismaService) {}

  async sendResetEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { email: email.toLowerCase() },
    });

    // Purge any prevous password reset tokens for security purposes
    await this.prisma.passwordReset.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const token = crypto.randomBytes(32).toString('hex');

    const passwordReset = await this.prisma.passwordReset.create({
      data: { userId: user.id, token: token },
    });

    console.log('sending password reset email to:', user.email);

    const serverToken = process.env.POSTMARK_TRANSACTIONAL_API_TOKEN!;
    const client = new ServerClient(serverToken);

    const baseUrl = process.env.APP_URL;
    const url = `${baseUrl}/password-reset/${passwordReset.token}`;

    await client.sendEmail({
      From: process.env.FROM_EMAIL!,
      To: user.email,
      Subject: 'Password Reset Instructions',
      HtmlBody: `
        <html>
            <body>
                <h1>Reset Your Password</h1>
                <p>Click the link below to reset your password</p>
                <a href="${url}">Reset Password</a>
            </body>
        </html>
    `,
    });

    console.log('password reset email sent');

    return true;
  }

  async resetPassword(token: string, password: string) {
    const passwordReset = await this.prisma.passwordReset.findFirstOrThrow({
      where: {
        token,
      },
    });

    const newPassword = this.hashData(password);

    await this.prisma.user.update({
      where: {
        id: passwordReset.userId,
      },
      data: {
        password: newPassword,
      },
    });

    // Purge the token from the system
    this.prisma.passwordReset.delete({
      where: {
        id: passwordReset.id,
      },
    });
  }

  private hashData(data: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
  }
}
