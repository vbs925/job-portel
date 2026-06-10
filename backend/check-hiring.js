const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany({ take: 3 });
  for(let j of jobs) {
    console.log(`Job: ${j.title}, hiringSteps:`, j.hiringSteps);
  }
}
main().finally(() => prisma.$disconnect());
