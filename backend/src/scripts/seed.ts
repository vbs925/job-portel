import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const JDs = {
  frontend: `We are looking for an experienced Frontend Developer to join our team. 

**Responsibilities:**
- Develop scalable and performant web applications using Next.js and React.
- Collaborate with designers to build pixel-perfect, dynamic UIs.
- Implement state management and interact with REST APIs.

**Requirements:**
- 3+ years of experience with React, TypeScript, and TailwindCSS.
- Strong understanding of web performance and SEO best practices.
- Ability to write clean, maintainable, and well-tested code.`,
  
  backend: `We are seeking a Backend Developer to power our highly scalable infrastructure.

**Responsibilities:**
- Design and build robust RESTful APIs using Node.js and Express.
- Manage databases (PostgreSQL/MongoDB) and optimize queries for high performance.
- Implement security best practices and ensure data protection.

**Requirements:**
- 3+ years experience with Node.js, Express, and Prisma ORM.
- Deep knowledge of SQL and NoSQL database architecture.
- Experience with Docker, CI/CD pipelines, and AWS/GCP deployments.`,
  
  tester: `Join us as a QA Automation Engineer to ensure the highest quality of our products.

**Responsibilities:**
- Write and execute automated test scripts using Cypress, Playwright, or Selenium.
- Perform manual exploratory testing on new features before release.
- Work closely with developers to identify and reproduce bugs.

**Requirements:**
- 2+ years of software testing experience.
- Proficiency in JavaScript/TypeScript for writing automation scripts.
- Familiarity with CI/CD integration for automated test runs.`,
  
  analyst: `We are looking for a Business/Data Analyst to drive data-informed decisions.

**Responsibilities:**
- Gather, analyze, and interpret complex data sets.
- Create dashboards and reports using Tableau, PowerBI, or Metabase.
- Collaborate with stakeholders to define business requirements and KPIs.

**Requirements:**
- Strong proficiency in SQL and Python/R for data analysis.
- Experience with A/B testing and statistical modeling.
- Excellent communication skills to present findings to non-technical teams.`
};

async function main() {
  console.log('Seeding Database...');

  // 1. Clear old jobs and applications
  await prisma.activityLog.deleteMany();
  await prisma.message.deleteMany();
  await prisma.interviewSlot.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.filterPreset.deleteMany();
  await prisma.job.deleteMany();

  // 2. Create the unified Company Manager
  let manager = await prisma.user.findFirst({ where: { role: 'MANAGER', email: 'careers@techcorp.in' } });
  
  if (!manager) {
    const hash = await bcrypt.hash('techcorp123', 10);
    manager = await prisma.user.create({
      data: {
        name: 'TechCorp HR',
        email: 'careers@techcorp.in',
        passwordHash: hash,
        role: 'MANAGER'
      }
    });
  }

  // 3. Define the Jobs
  const jobsData = [
    // Developers
    { title: 'Senior Frontend Developer', type: 'Full-time', location: 'Bangalore, India', salary: '₹18,00,000 - ₹25,00,000', description: JDs.frontend },
    { title: 'Frontend Engineer (React)', type: 'Full-time', location: 'Remote, India', salary: '₹12,00,000 - ₹16,00,000', description: JDs.frontend },
    { title: 'UI/UX Developer', type: 'Contract', location: 'Pune, India', salary: '₹8,00,000 - ₹12,00,000', description: JDs.frontend },
    { title: 'Senior Backend Engineer', type: 'Full-time', location: 'Bangalore, India', salary: '₹20,00,000 - ₹30,00,000', description: JDs.backend },
    { title: 'Node.js Developer', type: 'Full-time', location: 'Hyderabad, India', salary: '₹10,00,000 - ₹15,00,000', description: JDs.backend },
    { title: 'Fullstack JavaScript Developer', type: 'Full-time', location: 'Remote, India', salary: '₹15,00,000 - ₹22,00,000', description: JDs.frontend + '\n\n' + JDs.backend },
    
    // Testers
    { title: 'QA Automation Engineer', type: 'Full-time', location: 'Pune, India', salary: '₹8,00,000 - ₹14,00,000', description: JDs.tester },
    { title: 'Senior Software Tester', type: 'Full-time', location: 'Chennai, India', salary: '₹12,00,000 - ₹18,00,000', description: JDs.tester },
    { title: 'Manual QA Specialist', type: 'Contract', location: 'Remote, India', salary: '₹5,00,000 - ₹8,00,000', description: JDs.tester },
    { title: 'SDET (Software Dev in Test)', type: 'Full-time', location: 'Bangalore, India', salary: '₹16,00,000 - ₹24,00,000', description: JDs.tester },
    
    // Analysts
    { title: 'Senior Data Analyst', type: 'Full-time', location: 'Mumbai, India', salary: '₹14,00,000 - ₹20,00,000', description: JDs.analyst },
    { title: 'Business Intelligence Analyst', type: 'Full-time', location: 'Gurugram, India', salary: '₹10,00,000 - ₹16,00,000', description: JDs.analyst },
    { title: 'Product Analyst', type: 'Full-time', location: 'Bangalore, India', salary: '₹12,00,000 - ₹18,00,000', description: JDs.analyst },
    { title: 'Data Scientist', type: 'Full-time', location: 'Remote, India', salary: '₹20,00,000 - ₹35,00,000', description: JDs.analyst },
    { title: 'Junior Data Analyst', type: 'Internship', location: 'Mumbai, India', salary: '₹4,00,000 - ₹6,00,000', description: JDs.analyst },
  ];

  // Insert all jobs
  for (const job of jobsData) {
    await prisma.job.create({
      data: {
        title: job.title,
        company: 'TechCorp India',
        location: job.location,
        type: job.type,
        salary: job.salary,
        description: job.description,
        status: 'PUBLISHED',
        managerId: manager.id,
        hiringSteps: ["Applied", "Screening", "Technical Interview", "HR Round", "Offer"]
      }
    });
  }

  console.log(`Seeded ${jobsData.length} TechCorp India jobs.`);
  console.log('Manager Email: careers@techcorp.in');
  console.log('Manager Password: techcorp123');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
