import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { AuthDto } from '@/auth/dto/auth.dto';
import { Request, Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';

describe('AuthController - Unit Tests', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        PrismaModule,
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(), // Mock the signIn method
            logout: jest.fn(),
            refreshTokens: jest.fn(),
            createImpersonationToken: jest.fn(),
          },
        },
        UsersService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('should call authService.signIn with the correct data', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockResponse = {
        accessToken: 'some-token',
        refreshToken: 'refresh-token',
      };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockResponse);

      const result = await controller.signin(authDto);

      expect(authService.signIn).toHaveBeenCalledWith(authDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout when user is logged in', () => {
      const req = { user: { sub: 1 } } as unknown as Request;
      controller.logout(req);

      expect(authService.logout).toHaveBeenCalledWith(1);
    });

    it('should not call authService.logout if no user is logged in', () => {
      const req = {} as Request;
      controller.logout(req);

      expect(authService.logout).not.toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refreshTokens with the correct user id and refresh token', () => {
      const req = {
        user: { sub: 1, refreshToken: 'refresh-token' },
      } as unknown as Request;

      controller.refreshTokens(req);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        1,
        'refresh-token',
      );
    });
  });

  describe('getProfile', () => {
    it('should call usersService.findAdminByEmail with the correct email and return the user profile', async () => {
      const req = {
        user: { sub: 1, email: 'john@example.com' },
      } as unknown as Request;

      await prisma.user.create({
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'hashedpassword',
          isAdmin: true,
        },
      });

      const result = await controller.getProfile(req);

      expect(result).toEqual(
        expect.objectContaining({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isAdmin: true,
        }),
      );
    });
  });

  describe('impersonate', () => {
    it('should call authService.createImpersonationToken and return a redirect URL', async () => {
      const req = { user: { sub: 1 } } as unknown as Request;
      const res = { json: jest.fn() } as unknown as Response;
      const mockResponse = {
        token: 'my-token',
        redirectUrl: 'http://example.com',
      };

      jest
        .spyOn(authService, 'createImpersonationToken')
        .mockResolvedValue(mockResponse);

      await controller.impersonate(2, req, res);

      expect(authService.createImpersonationToken).toHaveBeenCalledWith(1, 2);
      expect(res.json).toHaveBeenCalledWith({
        redirectUrl: 'http://example.com',
      });
    });
  });
});
