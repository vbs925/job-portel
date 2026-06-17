const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  try {
    const jobs = await prisma.job.findMany();
    console.log('Jobs:', jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
