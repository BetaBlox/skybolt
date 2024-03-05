import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import colors from './fixtures/colors';

const prisma = new PrismaClient();

(async function main() {
  try {
    /**
     * Users
     */
    const user = await prisma.user.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        firstName: 'John',
        lastName: 'Rake',
        email: 'john@betablox.com',
        password: await argon2.hash('password'),
        isAdmin: true,
      },
    });

    const admin = await prisma.user.upsert({
      where: {
        id: 2,
      },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@betablox.com',
        password: await argon2.hash('password'),
        isAdmin: true,
      },
    });

    const standardUser = await prisma.user.upsert({
      where: {
        id: 3,
      },
      update: {},
      create: {
        firstName: 'Standard',
        lastName: 'User',
        email: 'user@betablox.com',
        password: await argon2.hash('password'),
        isAdmin: false,
      },
    });

    /**
     * Posts
     */
    await prisma.post.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        title:
          'TypeScript vs. JavaScript: Understanding the Differences and Benefits',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec vulputate libero, eu varius nisl. Mauris imperdiet pharetra lectus, ac malesuada elit consequat sit amet. Quisque at sapien ultricies ante facilisis malesuada. Aliquam commodo lectus at sapien malesuada fermentum. Duis sed fermentum est, ut feugiat nunc. Morbi arcu risus, egestas ac erat a, egestas pretium lectus. Fusce at dolor at lectus sollicitudin fermentum vitae eget mauris. Donec nec massa arcu. Nunc eleifend risus non augue lobortis lacinia. Vivamus pretium sit amet mi quis consequat. Proin in tincidunt velit, quis sollicitudin magna. Sed vel tempus tellus, in suscipit velit.',
        authorId: user.id,
      },
    });
    await prisma.post.upsert({
      where: {
        id: 2,
      },
      update: {},
      create: {
        title: 'Mastering TypeScript: Advanced Tips and Tricks for Developers',
        content:
          'Fusce neque turpis, auctor ac ultricies sit amet, sollicitudin nec odio. Integer lobortis felis a ultricies iaculis. Fusce dapibus molestie purus non ultricies. Aenean venenatis pellentesque tempus. Vestibulum auctor efficitur cursus. Quisque at lacus augue. Sed arcu enim, tincidunt eget ultricies a, aliquam sed mi. Etiam malesuada eleifend pharetra. Ut id felis quis diam rutrum aliquam. Sed sem quam, interdum non tempor ut, pulvinar vitae lorem. Nullam maximus, ex id lacinia dapibus, ex odio vestibulum metus, euismod rutrum ante nunc vestibulum justo. Duis velit tortor, tincidunt at odio et, rhoncus placerat ligula. Phasellus eget neque vehicula nisl consectetur iaculis nec non erat.',
        authorId: user.id,
      },
    });

    await prisma.post.upsert({
      where: {
        id: 3,
      },
      update: {},
      create: {
        title: 'Top Reasons Why Every Developer Should Learn TypeScript Today',
        content:
          'Ut pharetra, mauris in dignissim cursus, est libero vehicula ante, id fermentum enim diam non leo. Pellentesque vehicula, odio volutpat vestibulum dictum, turpis justo tincidunt arcu, at varius purus eros eget augue. Mauris a efficitur metus. Quisque at egestas sapien, eu facilisis tortor. Quisque ut dolor nisl. Fusce diam nunc, lacinia a mollis et, aliquam sed eros. Aliquam lacinia dui sapien, vitae posuere erat blandit ut. Donec nec mollis enim. Aliquam in nibh posuere, venenatis eros vel, molestie sapien. Sed nec sapien gravida, lobortis leo at, interdum orci. Aliquam ac arcu justo. Integer faucibus turpis felis, sed ultrices neque pretium convallis.',
        authorId: user.id,
      },
    });

    /**
     * Generate 100 random colors to test pagintation in admin
     */
    await prisma.color.deleteMany();

    await prisma.color.createMany({
      data: colors.map((c) => ({
        label: c[1],
        hex: c[0],
      })),
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
