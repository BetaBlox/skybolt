import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User, ImpersonationToken } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  let adminUser: User;
  let userToImpersonate: User;
  let impersonationToken: ImpersonationToken;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        UsersModule,
        JwtModule.register({}),
        PrismaModule,
      ],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    adminUser = await prisma.user.create({
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

    userToImpersonate = await prisma.user.create({
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

    impersonationToken = await prisma.impersonationToken.create({
      data: {
        token: 'test-impersonation-token',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
        targetUserId: userToImpersonate.id,
        adminUserId: adminUser.id,
      },
    });
  });

  it('should exchange a valid impersonation token for access and refresh tokens', async () => {
    // Call the exchangeImpersonationToken method
    const result = await authService.exchangeImpersonationToken(
      impersonationToken.token,
    );

    // Check that a valid access token and refresh token are returned
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');

    // Decode the tokens to ensure they contain the impersonated user's details
    const accessTokenPayload = jwtService.decode(result.accessToken) as any;
    const refreshTokenPayload = jwtService.decode(result.refreshToken) as any;

    expect(accessTokenPayload.sub).toEqual(userToImpersonate.id);
    expect(accessTokenPayload.email).toEqual(userToImpersonate.email);
    expect(accessTokenPayload.isImpersonated).toBe(true);
    expect(accessTokenPayload.impersonatedBy).toEqual(adminUser.id);

    expect(refreshTokenPayload.sub).toEqual(userToImpersonate.id);
    expect(refreshTokenPayload.email).toEqual(userToImpersonate.email);
    expect(refreshTokenPayload.isImpersonated).toBe(true);
    expect(refreshTokenPayload.impersonatedBy).toEqual(adminUser.id);
  });

  it('should throw UnauthorizedException for an expired impersonation token', async () => {
    // Expire the impersonation token
    await prisma.impersonationToken.update({
      where: { id: impersonationToken.id },
      data: { expiresAt: new Date(Date.now() - 10 * 60 * 1000) }, // Set expiration to 10 minutes ago
    });

    // Expect an error when trying to exchange the expired token
    await expect(
      authService.exchangeImpersonationToken(impersonationToken.token),
    ).rejects.toThrow(UnauthorizedException);
  });
});
