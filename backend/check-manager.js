const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const manager = await prisma.user.findUnique({
    where: { email: 'careers@techcorp.in' },
    include: {
      jobsPosted: {
        include: {
          applications: true
        }
      }
    }
  });

  if (!manager) {
    console.log("Manager not found!");
    return;
  }

  console.log(`Manager found: ${manager.id}`);
  console.log(`Jobs posted: ${manager.jobsPosted.length}`);
  let totalApps = 0;
  manager.jobsPosted.forEach(job => {
    console.log(`- Job: ${job.title} | Applicants: ${job.applications.length}`);
    totalApps += job.applications.length;
  });
  console.log(`Total applications: ${totalApps}`);
}

main().finally(() => prisma.$disconnect());
