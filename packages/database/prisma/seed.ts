import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const startOfYear = `${new Date().getFullYear()}-01-01`;
const endOfYear = `${new Date().getFullYear()}-12-31`;

function hashData(data: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(data, salt);
}

(async function main() {
  try {
    await seedUsers();
    await seedColors();
    await seedPosts();
    await seedProducts();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();

async function seedUsers() {
  console.log('Seeding default users...');

  // Always create these specific users
  await prisma.user.upsert({
    where: {
      id: 1,
    },
    update: {},
    create: {
      firstName: 'John',
      lastName: 'Rake',
      email: 'john@betablox.com',
      password: hashData('password'),
      isAdmin: true,
    },
  });

  await prisma.user.upsert({
    where: {
      id: 2,
    },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@betablox.com',
      password: hashData('password'),
      isAdmin: true,
    },
  });

  await prisma.user.upsert({
    where: {
      id: 3,
    },
    update: {},
    create: {
      firstName: 'Standard',
      lastName: 'User',
      email: 'user@betablox.com',
      password: hashData('password'),
      isAdmin: false,
    },
  });

  console.log('Seeding random users...');

  const randomUsers = Array.from({ length: 50 }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashData('password'), // Set a default password for all random users
    isAdmin: faker.datatype.boolean(),
    createdAt: faker.date.between({ from: startOfYear, to: endOfYear }),
    updatedAt: faker.date.between({ from: startOfYear, to: endOfYear }),
  }));

  await prisma.user.createMany({
    data: randomUsers,
    skipDuplicates: true, // Ensures no duplicate entries
  });
}

async function seedColors() {
  console.log('Seeding random colors...');

  const colors = Array.from({ length: 200 }, () => ({
    label: faker.color.human(), // Generate a random color label
    hex: faker.color.rgb({ format: 'hex' }), // Generate a random hex color
    createdAt: faker.date.between({ from: startOfYear, to: endOfYear }),
    updatedAt: faker.date.between({ from: startOfYear, to: endOfYear }),
  }));

  await prisma.color.createMany({
    data: colors,
  });
}

async function seedProducts() {
  console.log('Seeding products...');

  const products = Array.from({ length: 20 }, () => ({
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 10, max: 500 }), // Random price between 10 and 500
    stock: faker.number.int({ min: 1, max: 100 }), // Random stock between 1 and 100
    createdAt: faker.date.between({ from: startOfYear, to: endOfYear }),
    updatedAt: faker.date.between({ from: startOfYear, to: endOfYear }),
  }));

  await prisma.product.createMany({
    data: products,
  });
}

async function seedPosts() {
  console.log('Seeding posts...');

  // Fetch existing user IDs to associate with posts
  const users = await prisma.user.findMany({
    select: { id: true },
  });

  if (users.length === 0) {
    console.warn('No users found in the database. Please seed users first.');
    return;
  }

  const posts = Array.from({ length: 100 }, () => ({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(3),
    authorId: faker.helpers.arrayElement(users).id, // Assign a random existing user as the author
    createdAt: faker.date.between({ from: startOfYear, to: endOfYear }),
    updatedAt: faker.date.between({ from: startOfYear, to: endOfYear }),
  }));

  await prisma.post.createMany({
    data: posts,
  });
}
