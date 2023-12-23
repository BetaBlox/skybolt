import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UserRole } from 'database';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: { ...data, role: UserRole.VIEW_ONLY },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
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

  isFlyGoNoGo(user: User) {
    const requiredTrainings = [
      'LL01XC',
      'LL02XC',
      'LL07XC',
      'SS01XC',
      'SS06XC',
      'GS03XC',
      'GS06XC',
      'GA06XC',
      'PP11XC',
      'PP10XC',
    ];
  }

  isCMRGoNoGo(user: User) {
    const requiredTrainings = [
      'LL01XC',
      'LL02XC',
      'LL06XC',
      'LL07XC',
      'SS01XC',
      'SS02XC',
      'SS03XC',
      'SS05XC',
      'SS06XC',
      'GS03XC',
      'GA39XC',
      'GS47XC',
      'GS06XC',
      'GA06XC',
      'PP11XC',
      'PP10XC',
    ];
  }

  isBMCGoNoGo(user: User) {
    const requiredTrainings = [
      'LL01XC',
      'LL02XC',
      'LL06XC',
      'LL07XC',
      'SS01XC',
      'SS02XC',
      'SS03XC',
      'SS05XC',
      'SS06XC',
      'GS03XC',
      'GA39XC',
      'GS06XC',
      'GA06XC',
      'PP11XC',
      'PP10XC',
    ];
  }

  isAlertGoNoGo(user: User) {
    const requiredTrainings = [];
  }
}
