import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const managers = await prisma.user.findMany({ where: { role: 'MANAGER' } });
  console.log("Managers:", managers.length);
  if (managers.length > 0) {
    console.log("Manager email:", managers[0].email);
  } else {
    // Create one
    const passwordHash = await bcrypt.hash('password123', 10);
    const m = await prisma.user.create({
      data: { name: 'Demo Manager', email: 'manager@demo.com', passwordHash, role: 'MANAGER' }
    });
    console.log("Created manager:", m.email, "Password: password123");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
