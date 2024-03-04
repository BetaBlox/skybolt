import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { PasswordResetService } from './password-reset.service';

describe('PasswordResetController', () => {
  let controller: PasswordResetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PasswordResetController],
      providers: [PasswordResetService],
    }).compile();

    controller = module.get<PasswordResetController>(PasswordResetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
