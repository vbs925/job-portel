require('dotenv').config();
const { sendInterviewEmail } = require('./dist/lib/email.js');
async function run() {
  console.log("Using SMTP_USER:", process.env.SMTP_USER);
  await sendInterviewEmail("varunscram400@gmail.com", "Varun", "Senior Data Analyst", "2026-06-10", "10:00 AM", "http://meet");
  console.log("Done");
}
run();
