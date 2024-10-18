import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAdminByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
        isAdmin: true,
      },
    });
  }

  async findAdminById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
        isAdmin: true,
      },
    });
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string | null = null,
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    });
  }

  async changePassword(userId: number, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash the new password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Update the user's password in the database
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
