import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { getDashboards } from '@repo/admin-config';

export type SearchResults = Record<string, any[]>;

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: string): Promise<SearchResults> {
    const dashboards = getDashboards().filter(
      (dashboard) => dashboard.searchAttributes.length > 0,
    );
    const searchResults: SearchResults = {};

    try {
      // Create an array of promises to perform searches concurrently
      const searchPromises = dashboards.map(async (dashboard) => {
        const { modelName, searchAttributes } = dashboard;

        // Construct search conditions based on the query
        const searchConditions = searchAttributes.map((field) => ({
          [field]: {
            contains: query,
            mode: 'insensitive',
          },
        }));

        // Build the where clause
        const where = {
          OR: searchConditions,
        };

        // Perform the search using Prisma
        const results = await this.prisma[modelName].findMany({
          where,
          take: 10, // Limit the number of results per model
        });

        if (results.length > 0) {
          searchResults[modelName] = results;
        }
      });

      // Execute all search promises concurrently
      await Promise.all(searchPromises);

      return searchResults;
    } catch (error) {
      console.error('Error performing global search:', error);
      throw new Error('An error occurred while performing the global search.');
    }
  }
}
