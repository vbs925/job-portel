const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seedAdmin() {
  const email = 'superadmin@jobportal.com';
  const password = 'SuperSecurePassword123!';
  const name = 'Super Admin';

  try {
    const existingAdmin = await prisma.user.findUnique({ where: { email } });
    if (existingAdmin) {
      console.log('Super Admin already exists.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'SUPERADMIN'
      }
    });

    console.log('Super Admin created successfully:', admin.email);

    // Save to the root of the project
    const credentialsPath = path.join(__dirname, '../../admin_credentials.txt');
    const credentialsContent = `Super Admin Login Details:\nEmail: ${email}\nPassword: ${password}\nURL: http://localhost:3000/admin/login (assuming frontend route will be built)\n`;
    
    fs.writeFileSync(credentialsPath, credentialsContent, { encoding: 'utf8', flag: 'w' });
    console.log(`Credentials saved to ${credentialsPath}`);

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
