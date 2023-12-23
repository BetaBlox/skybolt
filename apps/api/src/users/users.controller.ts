import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AccessTokenGuard } from '@/common/guards/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll() {
    return await this.prisma.user.findMany();
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param() params: any) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: parseInt(params.id),
      },
    });
    const trainings = await this.prisma.userTraining.findMany({
      where: {
        userId: user.id,
      },
      include: {
        training: true,
      },
    });

    return {
      user,
      trainings,
    };
  }
}
