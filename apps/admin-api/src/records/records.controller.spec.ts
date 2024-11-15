import { Test, TestingModule } from '@nestjs/testing';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { FilterOperator, FilterType, RecordsPayload } from '@repo/types/admin';
import { SortDirection } from '@repo/types/sort';

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

  const baseMockResult: RecordsPayload = {
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
        operator: FilterOperator.CONTAINS,
        value: 'John',
        type: FilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: FilterOperator.EQUALS,
        value: 'John',
        type: FilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with STARTS_WITH operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: FilterOperator.STARTS_WITH,
        value: 'Jo',
        type: FilterType.TEXT,
      },
    },
    {
      description: 'should handle TEXT filter with ENDS_WITH operator',
      modelName: 'user',
      filter: {
        field: 'firstName',
        operator: FilterOperator.ENDS_WITH,
        value: 'hn',
        type: FilterType.TEXT,
      },
    },
    {
      description: 'should handle BOOLEAN filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'isAdmin',
        operator: FilterOperator.EQUALS,
        value: 'false',
        type: FilterType.BOOLEAN,
      },
    },
    {
      description: 'should handle DATE filter with EQUALS operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: FilterOperator.EQUALS,
        value: '2023-09-30',
        type: FilterType.DATE,
      },
    },
    {
      description: 'should handle DATE filter with GREATER_THAN operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: FilterOperator.GREATER_THAN,
        value: '2023-01-01',
        type: FilterType.DATE,
      },
    },
    {
      description: 'should handle DATE filter with LESS_THAN operator',
      modelName: 'user',
      filter: {
        field: 'createdAt',
        operator: FilterOperator.LESS_THAN,
        value: '2024-01-01',
        type: FilterType.DATE,
      },
    },
  ];

  testCases.forEach(({ description, modelName, filter }) => {
    it(description, async () => {
      const page = 1;
      const perPage = 10;
      const filters = [filter];

      // Mock the service response
      jest.spyOn(service, 'findMany').mockResolvedValue(baseMockResult);

      // Call the controller's method
      const result = await controller.findMany(
        modelName,
        page,
        perPage,
        JSON.stringify(filters),
      );

      // Verify that the service's findMany method was called with the correct arguments
      expect(service.findMany).toHaveBeenCalledWith(
        modelName,
        page,
        perPage,
        filters,
        'id',
        SortDirection.ASC,
      );

      // Verify that the result matches the mock result
      expect(result).toEqual(baseMockResult);
    });
  });

  it('should return sorted results by id in descending order by default', async () => {
    const modelName = 'user';
    const page = 1;
    const perPage = 10;
    const sortField = 'id';
    const sortOrder = SortDirection.ASC;
    const filters = [];

    const mockResult: RecordsPayload = {
      modelName: 'User',
      fields: [],
      paginatedResult: {
        data: [
          {
            id: 3,
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            isAdmin: false,
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            isAdmin: true,
          },
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            isAdmin: false,
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          next: null,
          perPage: 10,
          prev: null,
          total: 3,
        },
      },
    };

    jest.spyOn(service, 'findMany').mockResolvedValue(mockResult);

    const result = await controller.findMany(
      modelName,
      page,
      perPage,
      JSON.stringify(filters),
      sortField,
      sortOrder,
    );

    expect(service.findMany).toHaveBeenCalledWith(
      modelName,
      page,
      perPage,
      filters,
      sortField,
      sortOrder,
    );

    expect(result.paginatedResult.data[0].id).toBe(3);
    expect(result.paginatedResult.data[1].id).toBe(2);
    expect(result.paginatedResult.data[2].id).toBe(1);
  });

  it('should return sorted results by a custom field and order', async () => {
    const modelName = 'user';
    const page = 1;
    const perPage = 10;
    const sortField = 'firstName'; // Custom sortField
    const sortOrder = 'asc'; // Custom sortOrder
    const filters = [];

    const mockResult: RecordsPayload = {
      modelName: 'User',
      fields: [],
      paginatedResult: {
        data: [
          {
            id: 1,
            firstName: 'Alice',
            lastName: 'Johnson',
            email: 'alice@example.com',
            isAdmin: false,
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane@example.com',
            isAdmin: true,
          },
          {
            id: 3,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            isAdmin: false,
          },
        ],
        meta: {
          currentPage: 1,
          lastPage: 1,
          next: null,
          perPage: 10,
          prev: null,
          total: 3,
        },
      },
    };

    jest.spyOn(service, 'findMany').mockResolvedValue(mockResult);

    const result = await controller.findMany(
      modelName,
      page,
      perPage,
      JSON.stringify(filters),
      sortField,
      sortOrder,
    );

    expect(service.findMany).toHaveBeenCalledWith(
      modelName,
      page,
      perPage,
      filters,
      sortField,
      sortOrder,
    );

    expect(result.paginatedResult.data[0].firstName).toBe('Alice');
    expect(result.paginatedResult.data[1].firstName).toBe('Jane');
    expect(result.paginatedResult.data[2].firstName).toBe('John');
  });
});
