import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async function main() {
  try {
    // User
    const user = await prisma.user.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        name: "John Rake",
        email: "john@betablox.com",
      },
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
