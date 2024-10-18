import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UsersService,
        PrismaService, // Use Prisma for integration
        ConfigService, // Use Config for real environment variables
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('createImpersonationToken', () => {
    it('should create an impersonation token and return redirectUrl', async () => {
      const adminUser = await prisma.user.create({
        data: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@example.com',
          password: 'hashedpassword',
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const userToImpersonate = await prisma.user.create({
        data: {
          firstName: 'Impersonated',
          lastName: 'User',
          email: 'impersonated@example.com',
          password: 'hashedpassword',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const result = await authService.createImpersonationToken(
        adminUser.id,
        userToImpersonate.id,
      );

      const impersonationToken = await prisma.impersonationToken.findUnique({
        where: {
          token: result.token,
        },
      });

      expect(impersonationToken).toEqual(
        expect.objectContaining({
          token: result.token,
          adminUserId: adminUser.id,
          targetUserId: userToImpersonate.id,
          expiresAt: expect.any(Date),
        }),
      );
      expect(result.redirectUrl).toMatch(
        `http://localhost:3000/impersonate?token=${result.token}`,
      );
    });
  });
});
