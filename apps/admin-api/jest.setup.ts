import * as matchers from 'jest-extended';
import * as path from 'path';
import * as fs from 'fs';
import { parse } from 'yaml';
import { PrismaClient, getConnection } from '@repo/database';

expect.extend(matchers);

declare global {
  let prisma: PrismaClient;
}

(global as any).prisma = getConnection();

beforeAll(async () => {
  await truncateDatabase();
});

afterEach(async () => {
  jest.useRealTimers();
  await truncateDatabase();
});

global.createFixture = async <T>(fileName: string, key: string): Promise<T> => {
  const fixturePath = `fixtures/${fileName}.yml`;
  const data = fs.readFileSync(path.resolve(fixturePath));
  const a = parse(data.toString());

  // @ts-expect-error We're not sure what the dynamic type of prisma[entity] should be so just ignoring
  const record = await prisma[a.entity].create({
    data: { ...a.items[key] },
  });

  return record;
};

async function truncateDatabase() {
  const tableNames = ['User', 'PasswordReset', 'Product', 'Post', 'Color'];

  for (const tableName of tableNames) {
    await prisma.$queryRawUnsafe(
      `TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`,
    );
  }
}
