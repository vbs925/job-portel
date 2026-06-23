import prisma from '../lib/prisma';
import { sendRejectionEmail, sendStageUpdateEmail } from '../lib/email';

// The delay in minutes before an application is evaluated.
// Set to 60 for 1 hour. Can be overridden by environment variable for testing.
const DELAY_MINUTES = parseInt(process.env.ATS_DELAY_MINUTES || '60', 10);

export const startAtsCronService = () => {
  console.log(`Starting ATS Cron Service. Delay is set to ${DELAY_MINUTES} minutes.`);
  
  // Run every minute
  setInterval(async () => {
    try {
      const thresholdDate = new Date(Date.now() - DELAY_MINUTES * 60 * 1000);
      
      const pendingApplications = await prisma.application.findMany({
        where: {
          stage: 'In Progress',
          createdAt: {
            lte: thresholdDate
          }
        },
        include: {
          user: true,
          job: true
        }
      });

      if (pendingApplications.length > 0) {
        console.log(`Processing ${pendingApplications.length} delayed applications...`);
      }

      for (const application of pendingApplications) {
        // If ATS score is missing, default to 0 for evaluation purposes, or skip
        const score = application.atsScore || 0;
        const isRejected = score < 40;
        const newStage = isRejected ? 'Rejected' : 'Applied';
        
        // Update stage in the DB
        await prisma.application.update({
          where: { id: application.id },
          data: { stage: newStage }
        });

        // Log the activity
        await prisma.activityLog.create({
          data: {
            action: isRejected 
              ? 'Candidate Auto-Rejected after delay (Low ATS Score)'
              : 'Candidate Passed Initial ATS Screening',
            applicationId: application.id,
            actorId: application.userId // Logging as system or user
          }
        });

        // Send Emails
        if (application.user && application.user.email && application.job) {
          if (isRejected) {
            await sendRejectionEmail(
              application.user.email,
              application.user.name || 'Applicant',
              application.job.title
            );
          } else {
            // They passed the ATS check!
            await sendStageUpdateEmail(
              application.user.email,
              application.user.name || 'Applicant',
              application.job.title,
              newStage
            );
          }
        }
        
        console.log(`Processed application ${application.id}. New stage: ${newStage}`);
      }
    } catch (error) {
      console.error('Error in ATS Cron Service:', error);
    }
  }, 60 * 1000); // 1 minute polling interval
};
