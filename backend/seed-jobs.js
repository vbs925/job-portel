const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding jobs...");
  
  // Find a manager user to own these jobs
  let manager = await prisma.user.findFirst({
    where: { role: 'MANAGER' }
  });

  if (!manager) {
    console.log("No manager found. Creating a default manager...");
    manager = await prisma.user.create({
      data: {
        email: 'seed-manager@techcorp.com',
        passwordHash: 'dummy-hash',
        name: 'Seed Manager',
        role: 'MANAGER'
      }
    });
  }

  const hiringSteps = ["Screening", "Technical Interview", "HR Round", "Offer"];

  const jobsToCreate = [
    // Full-time
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp India',
      location: 'Bangalore, Hybrid',
      type: 'Full-time',
      salary: '₹30L - ₹45L',
      description: 'Looking for an experienced software engineer to lead our core product team.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Product Marketing Manager',
      company: 'GrowthMinds',
      location: 'Mumbai, On-site',
      type: 'Full-time',
      salary: '₹18L - ₹25L',
      description: 'Join our marketing team to drive product adoption across APAC region.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Data Scientist',
      company: 'Analytics Solutions',
      location: 'Hyderabad, Remote',
      type: 'Full-time',
      salary: '₹22L - ₹35L',
      description: 'Building predictive models for our enterprise clients.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },

    // Part-time
    {
      title: 'Customer Support Specialist',
      company: 'SupportHub',
      location: 'Pune, Remote',
      type: 'Part-time',
      salary: '₹4L - ₹6L',
      description: 'Flexible 4-hour shifts helping international clients resolve technical issues.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Content Writer',
      company: 'Creative Studio',
      location: 'Delhi, Remote',
      type: 'Part-time',
      salary: '₹5L - ₹8L',
      description: 'Writing technical blogs and documentation for our developer portal.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Social Media Associate',
      company: 'Brand Co',
      location: 'Chennai, Hybrid',
      type: 'Part-time',
      salary: '₹3L - ₹5L',
      description: 'Managing Instagram and Twitter profiles for local D2C brands.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },

    // Internship
    {
      title: 'Frontend Developer Intern',
      company: 'TechCorp India',
      location: 'Bangalore, On-site',
      type: 'Internship',
      salary: '₹25,000/month',
      description: '6-month internship working on React.js and Next.js applications.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'UI/UX Design Intern',
      company: 'DesignStudio',
      location: 'Mumbai, Hybrid',
      type: 'Internship',
      salary: '₹20,000/month',
      description: 'Assist in designing mobile app interfaces and creating wireframes.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'HR Intern',
      company: 'PeopleFirst',
      location: 'Delhi, On-site',
      type: 'Internship',
      salary: '₹15,000/month',
      description: 'Help our talent acquisition team screen resumes and schedule interviews.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },

    // Contract
    {
      title: 'Freelance DevOps Engineer',
      company: 'CloudWorks',
      location: 'Remote',
      type: 'Contract',
      salary: '₹1.5L/month',
      description: '3-month contract to migrate infrastructure to AWS using Terraform.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Mobile App Developer (Flutter)',
      company: 'AppFactory',
      location: 'Pune, Remote',
      type: 'Contract',
      salary: '₹1.2L/month',
      description: 'Short-term contract to build MVP for a food delivery startup.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    },
    {
      title: 'Cybersecurity Consultant',
      company: 'SecureNet',
      location: 'Hyderabad, On-site',
      type: 'Contract',
      salary: '₹2L/month',
      description: '6-month contract for conducting penetration testing and security audits.',
      status: 'PUBLISHED',
      hiringSteps,
      managerId: manager.id
    }
  ];

  let count = 0;
  for (const job of jobsToCreate) {
    await prisma.job.create({ data: job });
    count++;
  }

  console.log(`Successfully created ${count} jobs!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
