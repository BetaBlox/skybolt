import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';

describe('UsersController', () => {
  let controller: UsersController;
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.truncateDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(async () => {
    await prisma.truncateDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
