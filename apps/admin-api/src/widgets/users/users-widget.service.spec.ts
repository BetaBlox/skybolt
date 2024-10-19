import { Test, TestingModule } from '@nestjs/testing';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersWidgetService } from '@/widgets/users/users-widget.service';

describe('UsersWudgetService', () => {
  let service: UsersWidgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersWidgetService],
    }).compile();

    service = module.get<UsersWidgetService>(UsersWidgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
