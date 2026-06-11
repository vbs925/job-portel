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

  // Clear existing jobs and references to prevent duplicates/errors when re-seeding
  await prisma.activityLog.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.interviewSlot.deleteMany({});
  await prisma.savedJob.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});

  const hiringSteps = ["Screening", "Technical Interview", "HR Round", "Offer"];

  const jobsToCreate = [
    // Full-time
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp India',
      location: 'Bangalore, Hybrid',
      type: 'Full-time',
      salary: '₹30L - ₹45L',
      description: 'Looking for an experienced software engineer to lead our core product team. You will be responsible for architecting scalable backend services and mentoring junior engineers.',
      aboutCompany: 'TechCorp India is a fast-growing SaaS company building next-generation enterprise tools. We value innovation, transparency, and continuous learning.',
      keyResponsibilities: '- Architect and build scalable, reliable backend microservices.\n- Collaborate with product managers and designers to deliver high-quality features.\n- Mentor and guide junior engineers, providing code reviews and technical feedback.\n- Optimize application performance and ensure database scalability.',
      skillsNeeded: '- 5+ years of experience with Node.js, TypeScript, and modern backend frameworks.\n- Strong expertise in PostgreSQL and Redis.\n- Experience with Docker, Kubernetes, and AWS.\n- Excellent problem-solving skills and system design knowledge.',
      benefits: '- Comprehensive health insurance for you and your family.\n- Annual learning and development budget.\n- Flexible work hours and remote-friendly culture.\n- Generous equity package.',
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
      description: 'Join our marketing team to drive product adoption across the APAC region. You will craft compelling narratives and lead go-to-market strategies.',
      aboutCompany: 'GrowthMinds is a leading marketing automation platform helping B2B companies scale their lead generation efforts through AI-driven campaigns.',
      keyResponsibilities: '- Develop product positioning and messaging that differentiates our platform in the market.\n- Lead go-to-market strategies for new feature launches.\n- Create high-quality marketing assets, including case studies, whitepapers, and webinars.\n- Analyze market trends and competitor strategies to identify growth opportunities.',
      skillsNeeded: '- 4+ years of experience in product marketing or B2B SaaS marketing.\n- Exceptional written and verbal communication skills.\n- Experience with marketing automation tools like HubSpot or Marketo.\n- Strong analytical skills to measure campaign performance.',
      benefits: '- Performance-based annual bonuses.\n- Dedicated wellness and mental health allowance.\n- Unlimited paid time off (PTO).\n- Bi-annual company offsites.',
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
      description: 'Building predictive models for our enterprise clients. You will work on cutting-edge machine learning algorithms to solve complex business problems.',
      aboutCompany: 'Analytics Solutions provides bespoke data science consulting for Fortune 500 companies, specializing in predictive analytics and computer vision.',
      keyResponsibilities: '- Build and deploy predictive models using Python and scalable ML frameworks.\n- Collaborate with data engineers to build robust data pipelines.\n- Analyze complex datasets to extract actionable business insights.\n- Present findings to non-technical stakeholders in a clear and concise manner.',
      skillsNeeded: '- Deep understanding of machine learning algorithms and statistical modeling.\n- Proficiency in Python, Pandas, Scikit-learn, and TensorFlow/PyTorch.\n- Experience with SQL and cloud data warehouses like Snowflake or BigQuery.\n- Strong background in mathematics or statistics.',
      benefits: '- Fully remote work policy.\n- Home office setup allowance.\n- Continuous learning budget for certifications and courses.\n- Comprehensive medical coverage.',
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
      aboutCompany: 'SupportHub provides 24/7 technical support solutions for global tech startups, ensuring high customer satisfaction and retention.',
      keyResponsibilities: '- Respond to customer inquiries via email, chat, and phone.\n- Troubleshoot technical issues and guide users through software configurations.\n- Escalate complex bugs to the engineering team.\n- Maintain and update internal knowledge base articles.',
      skillsNeeded: '- Excellent written and verbal communication skills in English.\n- Empathy and patience when dealing with frustrated customers.\n- Basic understanding of web technologies and APIs is a plus.\n- Ability to multitask and handle high-volume support requests.',
      benefits: '- Flexible shift timings to suit your schedule.\n- Internet and electricity allowance.\n- Opportunity to transition to a full-time role based on performance.',
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
      aboutCompany: 'Creative Studio is an agency focused on producing high-quality, developer-centric technical content for fast-growing API companies.',
      keyResponsibilities: '- Research and write in-depth technical tutorials and how-to guides.\n- Create clear and concise API documentation.\n- Collaborate with subject matter experts to ensure technical accuracy.\n- Optimize content for SEO to drive organic traffic.',
      skillsNeeded: '- Proven experience in technical writing or blogging.\n- Familiarity with web development concepts (HTML, CSS, JavaScript).\n- Understanding of SEO best practices.\n- Ability to explain complex technical concepts simply.',
      benefits: '- Work from anywhere with completely flexible hours.\n- Pay per article or fixed monthly retainer options.\n- Access to premium writing and SEO tools.',
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
      aboutCompany: 'Brand Co is a boutique digital marketing agency helping direct-to-consumer brands establish a strong online presence and build community.',
      keyResponsibilities: '- Create and schedule engaging content across Instagram, Twitter, and LinkedIn.\n- Monitor brand mentions and reply to comments/messages.\n- Brainstorm viral campaign ideas and short-form video concepts.\n- Track and report on basic social media metrics.',
      skillsNeeded: '- Active user and strong understanding of current social media trends.\n- Basic graphic design skills (Canva) and video editing (CapCut).\n- Creative copywriting skills.\n- Highly organized and detail-oriented.',
      benefits: '- Fun, creative work environment.\n- Free product samples from our D2C clients.\n- Mentorship from senior marketing strategists.',
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
      aboutCompany: 'TechCorp India is building scalable SaaS solutions. We believe in nurturing young talent and giving interns real responsibilities from day one.',
      keyResponsibilities: '- Translate Figma designs into responsive React components.\n- Write clean, maintainable, and well-documented frontend code.\n- Assist the team in fixing bugs and improving UI performance.\n- Participate in daily stand-ups and sprint planning.',
      skillsNeeded: '- Good understanding of HTML, CSS, and modern JavaScript (ES6+).\n- Familiarity with React.js or Next.js.\n- Basic knowledge of Git and version control.\n- Eagerness to learn and take constructive feedback.',
      benefits: '- Pre-placement offer (PPO) opportunity upon successful completion.\n- Free lunch and snacks at the office.\n- 1-on-1 mentorship with senior developers.',
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
      aboutCompany: 'DesignStudio is an award-winning creative agency specializing in crafting seamless digital experiences for fintech and healthcare startups.',
      keyResponsibilities: '- Create user flows, wireframes, and low-fidelity prototypes.\n- Assist senior designers in crafting high-fidelity UI designs in Figma.\n- Conduct basic user research and usability testing.\n- Help maintain and update the company design system.',
      skillsNeeded: '- Strong portfolio demonstrating UI/UX principles and visual design skills.\n- Proficiency in Figma.\n- Understanding of mobile-first design and responsive layouts.\n- Good communication skills to present design concepts.',
      benefits: '- Opportunity to work on high-impact client projects.\n- Access to premium design resources and courses.\n- Flexible working hours.',
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
      aboutCompany: 'PeopleFirst is a rapidly expanding HR consultancy firm dedicated to finding top talent for emerging startups in the tech ecosystem.',
      keyResponsibilities: '- Source candidates through LinkedIn and job portals.\n- Screen resumes and conduct initial phone screens.\n- Coordinate interview schedules between candidates and hiring managers.\n- Assist with employee onboarding and documentation.',
      skillsNeeded: '- Pursuing or recently completed a degree in Human Resources or Business.\n- Excellent organizational and time-management skills.\n- Strong interpersonal and communication skills.\n- Familiarity with Google Workspace or MS Office.',
      benefits: '- Gain hands-on experience in full-cycle recruiting.\n- Certificate of completion and letter of recommendation.\n- Monthly team outings.',
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
      aboutCompany: 'CloudWorks is a specialized infrastructure consultancy helping legacy businesses transition securely and efficiently to the cloud.',
      keyResponsibilities: '- Assess current on-premise infrastructure and plan migration strategy.\n- Write Infrastructure as Code (IaC) using Terraform.\n- Set up CI/CD pipelines using GitHub Actions.\n- Implement cloud security best practices and monitoring alerts.',
      skillsNeeded: '- Proven experience migrating applications to AWS.\n- Strong expertise in Terraform and Docker.\n- Experience with Linux system administration and bash scripting.\n- AWS certifications are a huge plus.',
      benefits: '- Fully remote role.\n- Flexible working hours as long as deadlines are met.\n- Potential for contract extension based on project success.',
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
      description: 'Short-term contract to build an MVP for a food delivery startup.',
      aboutCompany: 'AppFactory is an app development studio that partners with early-stage founders to bring their mobile application ideas to life quickly.',
      keyResponsibilities: '- Develop a cross-platform mobile application using Flutter from scratch.\n- Integrate RESTful APIs and real-time location tracking features.\n- Ensure responsive design across various device screen sizes.\n- Publish the app to the Google Play Store and Apple App Store.',
      skillsNeeded: '- 2+ years of experience with Flutter and Dart.\n- Experience integrating third-party APIs (e.g., Google Maps, Stripe).\n- Solid understanding of state management (Provider, Riverpod, or BLoC).\n- Portfolio of previously published mobile applications.',
      benefits: '- Competitive monthly rate.\n- Work independently with minimal meetings.\n- Great addition to your freelance portfolio.',
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
      aboutCompany: 'SecureNet is a leading cybersecurity firm providing auditing and compliance services to the banking and financial services sector.',
      keyResponsibilities: '- Conduct comprehensive network and application penetration testing.\n- Identify vulnerabilities and provide actionable remediation reports.\n- Review source code for security flaws.\n- Assist clients with SOC2 and ISO compliance readiness.',
      skillsNeeded: '- 4+ years of experience in ethical hacking or cybersecurity consulting.\n- CEH, OSCP, or CISSP certification is highly preferred.\n- Proficiency with tools like Burp Suite, Metasploit, and Nessus.\n- Strong understanding of OWASP Top 10 vulnerabilities.',
      benefits: '- High-paying contract role.\n- Work with top-tier financial clients.\n- Access to premium security testing tools.',
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
