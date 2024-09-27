import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import {
  AdminFilterOperator,
  AdminFilterType,
  AdminRecordsPayload,
} from '@repo/types';

describe('RecordsController - Unit Test with Filter Types', () => {
  let controller: RecordsController;
  let service: RecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordsController],
      providers: [
        {
          provide: RecordsService,
          useValue: {
            findMany: jest.fn(), // Mock the findMany method
          },
        },
      ],
    }).compile();

    controller = module.get<RecordsController>(RecordsController);
    service = module.get<RecordsService>(RecordsService);
  });

  const baseMockResult: AdminRecordsPayload = {
    fields: [],
    modelName: 'User',
    paginatedResult: {
      data: [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isAdmin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      meta: {
        currentPage: 1,
        lastPage: 1,
        next: null,
        perPage: 10,
        prev: null,
        total: 1,
      },
    },
  };

  const testCases = [
    {
      description: 'should handle TEXT filter with CONTAINS operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: AdminFilterOperator.CONTAINS,
        value: 'John',
        type: AdminFilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: AdminFilterOperator.EQUALS,
        value: 'John',
        type: AdminFilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with STARTS_WITH operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: AdminFilterOperator.STARTS_WITH,
        value: 'Jo',
        type: AdminFilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with ENDS_WITH operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: AdminFilterOperator.ENDS_WITH,
        value: 'hn',
        type: AdminFilterType.TEXT,
      },
    },
    {
      description: 'should handle BOOLEAN filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'isAdmin',
        operator: AdminFilterOperator.EQUALS,
        value: 'false',
        type: AdminFilterType.BOOLEAN,
      },
    },
    {
      description: 'should handle DATE filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: AdminFilterOperator.EQUALS,
        value: '2023-09-30',
        type: AdminFilterType.DATE,
      },
    },
    {
      description: 'should handle DATE filter with GREATER_THAN operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: AdminFilterOperator.GREATER_THAN,
        value: '2023-01-01',
        type: AdminFilterType.DATE,
      },
    },
    {
      description: 'should handle DATE filter with LESS_THAN operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: AdminFilterOperator.LESS_THAN,
        value: '2024-01-01',
        type: AdminFilterType.DATE,
      },
    },
  ];

  testCases.forEach(({ description, modelName, filter }) => {
    it(description, async () => {
      const page = 1;
      const perPage = 10;
      const search = '';
      const filters = [filter];

      // Mock the service response
      jest.spyOn(service, 'findMany').mockResolvedValue(baseMockResult);

      // Call the controller's method
      const result = await controller.findMany(
        modelName,
        search,
        page,
        perPage,
        JSON.stringify(filters),
      );

      // Verify that the service's findMany method was called with the correct arguments
      expect(service.findMany).toHaveBeenCalledWith(
        modelName,
        search,
        page,
        perPage,
        filters,
      );

      // Verify that the result matches the mock result
      expect(result).toEqual(baseMockResult);
    });
  });
});
