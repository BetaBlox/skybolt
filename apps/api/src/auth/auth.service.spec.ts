import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { User, ImpersonationToken } from '@prisma/client';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  let adminUser: User;
  let userToImpersonate: User;
  let existingUser: User;
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

    existingUser = await prisma.user.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: bcrypt.hashSync('password', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const newUserData = {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'newpassword',
      };

      const tokens = await authService.signUp(newUserData);

      // Verify the new user was created in the database
      const newUser = await prisma.user.findUnique({
        where: { email: newUserData.email },
      });

      expect(newUser).not.toBeNull();
      expect(newUser.email).toBe(newUserData.email);

      // Verify tokens
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should not sign up if the user already exists', async () => {
      const existingUserData = {
        firstName: 'Test',
        lastName: 'User',
        email: existingUser.email,
        password: 'password',
      };

      await expect(authService.signUp(existingUserData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('should sign in an existing user with correct credentials', async () => {
      const loginData = {
        email: existingUser.email,
        password: 'password',
      };

      const tokens = await authService.signIn(loginData);

      // Verify tokens
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
    });

    it('should throw an error if the user does not exist during sign in', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      await expect(authService.signIn(loginData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const tokens = await authService.getTokens(
        existingUser.id,
        existingUser.email,
      );
      await authService.updateRefreshToken(
        existingUser.id,
        tokens.refreshToken,
      );

      const newTokens = await authService.refreshTokens(
        existingUser.id,
        tokens.refreshToken,
      );

      // Verify new tokens
      expect(newTokens).toHaveProperty('accessToken');
      expect(newTokens).toHaveProperty('refreshToken');
    });

    it('should throw ForbiddenException for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalidToken';

      await expect(
        authService.refreshTokens(existingUser.id, invalidRefreshToken),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('logout', () => {
    it('should logout the user and clear refresh token', async () => {
      await authService.logout(existingUser.id);

      const userAfterLogout = await prisma.user.findUnique({
        where: { id: existingUser.id },
      });

      expect(userAfterLogout.refreshToken).toBeNull();
    });
  });

  describe('updateRefreshToken', () => {
    it('should hash the refresh token and update it', async () => {
      const tokens = await authService.getTokens(
        existingUser.id,
        existingUser.email,
      );
      await authService.updateRefreshToken(
        existingUser.id,
        tokens.refreshToken,
      );

      const user = await prisma.user.findUnique({
        where: { id: existingUser.id },
      });

      expect(user.refreshToken).not.toEqual(tokens.refreshToken); // Should be hashed
      const refreshTokenMatches = bcrypt.compareSync(
        tokens.refreshToken,
        user.refreshToken,
      );
      expect(refreshTokenMatches).toBe(true); // Ensure the hash matches
    });
  });

  describe('getTokens', () => {
    it('should return valid access and refresh tokens', async () => {
      const tokens = await authService.getTokens(
        existingUser.id,
        existingUser.email,
      );

      // Verify tokens
      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');

      // Decode the tokens to ensure they have the correct user information
      const accessTokenPayload = jwtService.decode(tokens.accessToken) as any;
      const refreshTokenPayload = jwtService.decode(tokens.refreshToken) as any;

      expect(accessTokenPayload.sub).toEqual(existingUser.id);
      expect(refreshTokenPayload.sub).toEqual(existingUser.id);
    });
  });

  describe('changePassword', () => {
    it('should change the user password and hash it', async () => {
      const newPassword = 'newpassword123';
      await authService.changePassword(existingUser.id, newPassword);

      const updatedUser = await prisma.user.findUnique({
        where: { id: existingUser.id },
      });

      expect(updatedUser.password).not.toEqual('password'); // Should be updated

      const passwordMatches = bcrypt.compareSync(
        newPassword,
        updatedUser.password,
      );
      expect(passwordMatches).toBe(true); // Ensure the new password matches the hash
    });
  });

  describe('exchangeImpersonationToken', () => {
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
});
