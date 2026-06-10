const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany();
  let updated = 0;
  
  for (const job of jobs) {
    if (job.hiringSteps && Array.isArray(job.hiringSteps)) {
      if (!job.hiringSteps.includes('Applied')) {
        const newSteps = ['Applied', ...job.hiringSteps];
        await prisma.job.update({
          where: { id: job.id },
          data: { hiringSteps: newSteps }
        });
        updated++;
      }
    } else {
      // If null, set default
      await prisma.job.update({
        where: { id: job.id },
        data: { hiringSteps: ['Applied', 'Screening', 'Interview', 'Offer'] }
      });
      updated++;
    }
  }
  
  console.log(`Updated ${updated} jobs to include 'Applied' step.`);
}

main().finally(() => prisma.$disconnect());
