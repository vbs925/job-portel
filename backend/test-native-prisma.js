const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function main() {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL
    });
    const count = await prisma.user.count();
    console.log('Database count:', count);
    await prisma.$disconnect();
  } catch (e) {
    console.error('Prisma Error:', e.message);
  }
}
main();
