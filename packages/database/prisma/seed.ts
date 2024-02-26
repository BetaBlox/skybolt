import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

(async function main() {
  try {
    await prisma.user.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        firstName: "John",
        lastName: "Rake",
        email: "john@betablox.com",
        password: await argon2.hash("password"),
        isAdmin: true,
      },
    });
    
    await prisma.user.upsert({
      where: {
        id: 2,
      },
      update: {},
      create: {
        firstName: "Admin",
        lastName: "User",
        email: "admin@betablox.com",
        password: await argon2.hash("password"),
        isAdmin: true,
      },
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
