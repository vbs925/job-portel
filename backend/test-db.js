const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const apps = await prisma.application.findMany({
    select: { id: true, stage: true, status: true, user: { select: { name: true } } }
  });
  console.log('Apps:', apps);
}
main().catch(console.error).finally(() => prisma.$disconnect());
