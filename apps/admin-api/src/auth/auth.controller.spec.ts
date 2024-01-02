import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('AuthController', () => {
  let controller: AuthController;
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.truncateDatabase();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({}),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should create a new user', async () => {
      await controller.signup({
        firstName: 'John',
        lastName: 'Rake',
        email: 'john@betablox.com',
        password: 'password',
      });

      const user = await prisma.user.findFirstOrThrow({
        where: { email: 'john@betablox.com' },
      });
      expect(user).toEqual(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Rake',
          email: 'john@betablox.com',
          isAdmin: false,
        }),
      );
    });
  });
});
