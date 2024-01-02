import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PrismaModule } from '@/prisma/prisma.module';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.truncateDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await prisma.truncateDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
