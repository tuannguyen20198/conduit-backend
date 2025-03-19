import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Tạo Users từng cái để tránh lỗi kiểu dữ liệu
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'user1',
      password: 'hashedpassword1',
      bio: 'Bio of user1',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'user2',
      password: 'hashedpassword2',
      bio: 'Bio of user2',
    },
  });
  const user3 = await prisma.user.create({
    data: {
      email: 'user3@example.com',
      username: 'user3',
      password: 'hashedpassword3',
      bio: 'Bio of user3',
    },
  });
  const user4 = await prisma.user.create({
    data: {
      email: 'user4@example.com',
      username: 'user4',
      password: 'hashedpassword4',
      bio: 'Bio of user4',
    },
  });

  // Tạo Tags
  const tag1 = await prisma.tag.create({ data: { name: 'technology' } });
  const tag2 = await prisma.tag.create({ data: { name: 'health' } });
  const tag3 = await prisma.tag.create({ data: { name: 'travel' } });
  const tag4 = await prisma.tag.create({ data: { name: 'education' } });

  // Tạo Articles
  const article1 = await prisma.article.create({
    data: {
      title: 'Learning Prisma',
      slug: 'learning-prisma',
      description: 'Guide to Prisma ORM',
      body: 'This article explains Prisma ORM with PostgreSQL.',
      authorId: user1.id,
      tagList: { connect: [{ id: tag1.id }] },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Healthy Eating',
      slug: 'healthy-eating',
      description: 'Tips for healthy food',
      body: 'Eat more vegetables and avoid junk food.',
      authorId: user2.id,
      tagList: { connect: [{ id: tag2.id }] },
    },
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'Traveling Tips',
      slug: 'traveling-tips',
      description: 'Guide for traveling',
      body: 'Always pack light and carry essential items.',
      authorId: user3.id,
      tagList: { connect: [{ id: tag3.id }] },
    },
  });

  // Tạo Comments
  await prisma.comment.create({
    data: {
      body: 'Great article!',
      articleId: article1.id,
      authorId: user2.id,
    },
  });

  await prisma.comment.create({
    data: { body: 'Very helpful!', articleId: article2.id, authorId: user3.id },
  });

  await prisma.comment.create({
    data: { body: 'Nice tips!', articleId: article3.id, authorId: user1.id },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
