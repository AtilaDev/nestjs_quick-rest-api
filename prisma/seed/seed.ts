import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany({});

  // Create 100 users
  const users = Array.from({ length: 100 }, () => ({
    username: faker.internet.username(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    birthdate: faker.date.birthdate(),
  }));

  // Create users in database
  // for (const user of users) {
  //   await prisma.user.create({
  //     data: user,
  //   });
  // }

  console.log('Successfully seeded 100 users');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
