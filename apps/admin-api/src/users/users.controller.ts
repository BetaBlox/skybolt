import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
