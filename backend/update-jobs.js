const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.job.findMany();
  
  for (const job of jobs) {
    let description = '';
    
    if (job.title.toLowerCase().includes('frontend')) {
      description = `Join us as a ${job.title} to build amazing user experiences.\n\n**Key Responsibilities**\n- Develop and maintain scalable web applications.\n- Collaborate with designers and backend teams.\n- Optimize applications for maximum speed and scalability.\n\n**Required Skills & Experience**\n- 2+ years of experience with React, Vue, or similar frameworks.\n- Strong proficiency in JavaScript/TypeScript.\n- Familiarity with modern front-end build pipelines and tools.`;
    } else if (job.title.toLowerCase().includes('backend')) {
      description = `We are seeking a ${job.title} to build robust and scalable systems.\n\n**Key Responsibilities**\n- Design and implement RESTful APIs.\n- Optimize database queries and schema design.\n- Ensure system reliability and performance.\n\n**Required Skills & Experience**\n- 3+ years of experience with Node.js, Python, or Java.\n- Strong understanding of SQL and NoSQL databases.\n- Experience with cloud platforms (AWS/GCP/Azure).`;
    } else if (job.title.toLowerCase().includes('data')) {
      description = `We are looking for a ${job.title} to uncover insights from our vast datasets.\n\n**Key Responsibilities**\n- Build predictive models and machine learning algorithms.\n- Perform exploratory data analysis to identify trends.\n- Create data visualizations and dashboards.\n\n**Required Skills & Experience**\n- Proven experience in data science or analytics.\n- Proficiency in Python/R and SQL.\n- Experience with libraries like Pandas, NumPy, Scikit-learn.`;
    } else if (job.title.toLowerCase().includes('qa') || job.title.toLowerCase().includes('test')) {
      description = `Join us as a ${job.title} to ensure the highest quality of our products.\n\n**Key Responsibilities**\n- Write and execute automated test scripts.\n- Perform manual exploratory testing on new features before release.\n- Work closely with developers to identify and reproduce bugs.\n\n**Required Skills & Experience**\n- 2+ years of software testing experience.\n- Proficiency in JavaScript/TypeScript for writing automation scripts.\n- Familiarity with CI/CD integration for automated test runs.`;
    } else if (job.title.toLowerCase().includes('manager') || job.title.toLowerCase().includes('lead')) {
      description = `We are seeking a ${job.title} to lead and inspire our team.\n\n**Key Responsibilities**\n- Guide team members and foster a collaborative environment.\n- Oversee project delivery from conception to completion.\n- Align team objectives with company goals.\n\n**Required Skills & Experience**\n- 5+ years of experience in a relevant field with leadership roles.\n- Strong project management and organizational skills.\n- Excellent communication and stakeholder management abilities.`;
    } else {
      // Generic fallback
      description = `We are excited to welcome a ${job.title} to our growing team.\n\n**Key Responsibilities**\n- Contribute to core business objectives and team goals.\n- Collaborate cross-functionally to drive success.\n- Continuously improve processes and workflows.\n\n**Required Skills & Experience**\n- Proven experience in a similar role.\n- Strong problem-solving and critical thinking skills.\n- Excellent communication and teamwork abilities.`;
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { description }
    });
  }
  
  console.log(`Updated ${jobs.length} jobs with formatted descriptions.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
