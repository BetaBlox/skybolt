import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { SearchService } from '@/search/search.service';

describe('SearchService - Integration Test', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, PrismaService],
    }).compile();

    service = module.get<SearchService>(SearchService);

    const johnDoe = await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        isAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const janeSmith = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'hashedpassword',
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.product.createMany({
      data: [
        { name: 'Product A', price: 50, stock: 10 },
        { name: 'Product B', price: 100, stock: 20 },
      ],
    });

    await prisma.post.createMany({
      data: [
        {
          title: 'First Post',
          content: 'Content of the first post',
          authorId: johnDoe.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Second Post',
          content: 'Content of the second post',
          authorId: janeSmith.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    });
  });

  it('should return results for a given search query across multiple models', async () => {
    const results = await service.globalSearch('john');

    expect(results).toBeDefined();
    expect(results).toHaveProperty('User');
    expect(results.User).toHaveLength(1);
    expect(results.User).toIncludeAllPartialMembers([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      },
    ]);
  });

  it('should return no results if the query does not match any records', async () => {
    const results = await service.globalSearch('nonexistent');

    expect(results).toEqual({});
  });

  it('should limit the number of results per model to 10', async () => {
    // Assuming there are more than 10 products, we expect only 10 results to be returned
    for (let i = 0; i < 15; i++) {
      await prisma.product.create({
        data: { name: `Product ${i + 1}`, price: 100, stock: 20 },
      });
    }

    const results = await service.globalSearch('Product');

    expect(results).toBeDefined();
    expect(results.Product).toHaveLength(10);

    expect(results.Product).toIncludeAllPartialMembers([
      // Created these for all tests
      { name: 'Product A', price: 50, stock: 10 },
      { name: 'Product B', price: 100, stock: 20 },
      // Now are the new ones
      { name: 'Product 1', price: 100, stock: 20 },
      { name: 'Product 2', price: 100, stock: 20 },
      { name: 'Product 3', price: 100, stock: 20 },
      { name: 'Product 4', price: 100, stock: 20 },
      { name: 'Product 5', price: 100, stock: 20 },
      { name: 'Product 6', price: 100, stock: 20 },
      { name: 'Product 7', price: 100, stock: 20 },
      { name: 'Product 8', price: 100, stock: 20 },
    ]);
  });

  it('should be able to search across multiple models', async () => {
    const results = await service.globalSearch('Post');

    expect(results).toBeDefined();
    expect(results.Post).toHaveLength(2);
    expect(results.Post).toIncludeAllPartialMembers([
      { title: 'First Post' },
      { title: 'Second Post' },
    ]);
  });
});
