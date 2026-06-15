const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({ where: { email: 'careers@techcorp.in' } });
  console.log("Role:", user.role);
  const match = await bcrypt.compare('Manager123!', user.passwordHash);
  console.log("Password matches:", match);
}

main().finally(() => prisma.$disconnect());
