import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { sendInterviewEmail, sendStageUpdateEmail, sendRejectionEmail } from '../lib/email';

// Middleware to ensure user is a MANAGER
const isManager = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'MANAGER') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

router.use(authenticate);
router.use(isManager);

// POST /manager/actions/:id/schedule
router.post('/:id/schedule', async (req: any, res: any) => {
  try {
    const applicationId = req.params.id;
    const managerId = req.user.id;
    const { startTime, endTime } = req.body;

    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        job: {
          managerId: managerId
        }
      },
      include: { user: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found or access denied.' });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'Start time and end time are required.' });
    }

    const hiringSteps: string[] = (application.job?.hiringSteps as string[]) || ["Applied", "Screening", "Interview", "Offer"];
    let targetStage = hiringSteps.find(step => step.toLowerCase().includes('interview'));
    
    if (!targetStage) {
      const currentIndex = hiringSteps.indexOf(application.stage);
      targetStage = currentIndex >= 0 && currentIndex < hiringSteps.length - 1 
        ? hiringSteps[currentIndex + 1] 
        : hiringSteps[2] || 'Interview';
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { stage: targetStage }
    });

    const start = new Date(startTime);
    const end = new Date(endTime);
    const mockLink = "https://meet.google.com/mock-link-123";
    
    await prisma.interviewSlot.create({
      data: {
        applicationId,
        startTime: start,
        endTime: end,
        status: "PROPOSED",
        meetingLink: mockLink
      }
    });

    await prisma.activityLog.create({
      data: {
        action: `Scheduled an interview for ${start.toLocaleString()}`,
        applicationId,
        actorId: managerId
      }
    });

    if (application.user?.email && application.job?.title) {
      await sendInterviewEmail(
        application.user.email,
        application.user.name || 'Applicant',
        application.job.title,
        start.toLocaleDateString(),
        `${start.toLocaleTimeString()} to ${end.toLocaleTimeString()}`,
        mockLink
      );
    }

    res.json({ message: 'Candidate moved to Interview stage and meeting scheduled successfully', application: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while scheduling' });
  }
});

// POST /manager/actions/:id/stage
router.post('/:id/stage', async (req: any, res: any) => {
  try {
    const applicationId = req.params.id;
    const managerId = req.user.id;
    const { stage } = req.body;

    if (!stage) return res.status(400).json({ message: 'Stage is required' });

    const application = await prisma.application.findFirst({
      where: { id: applicationId, job: { managerId: managerId } },
      include: { user: true, job: true }
    });

    if (!application) return res.status(404).json({ message: 'Application not found or access denied.' });

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { stage }
    });

    await prisma.activityLog.create({
      data: { action: `Moved to ${stage} stage`, applicationId, actorId: managerId }
    });

    if (application.user?.email && application.job?.title && stage !== 'Rejected') {
      await sendStageUpdateEmail(application.user.email, application.user.name || 'Applicant', application.job.title, stage);
    }

    res.json({ message: 'Stage updated successfully', application: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while updating stage' });
  }
});

// POST /manager/actions/:id/reject
router.post('/:id/reject', async (req: any, res: any) => {
  try {
    const applicationId = req.params.id;
    const managerId = req.user.id;

    const application = await prisma.application.findFirst({
      where: { id: applicationId, job: { managerId: managerId } },
      include: { user: true, job: true }
    });

    if (!application) return res.status(404).json({ message: 'Application not found or access denied.' });

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { stage: 'Rejected' }
    });

    await prisma.activityLog.create({
      data: { action: 'Candidate Rejected', applicationId, actorId: managerId }
    });

    if (application.user?.email && application.job?.title) {
      await sendRejectionEmail(application.user.email, application.user.name || 'Applicant', application.job.title);
    }

    res.json({ message: 'Candidate rejected successfully', application: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while rejecting candidate' });
  }
});

// POST /manager/actions/:id/message
router.post('/:id/message', async (req: any, res: any) => {
  try {
    const applicationId = req.params.id;
    const managerId = req.user.id;
    const { content } = req.body;

    const application = await prisma.application.findFirst({
      where: { id: applicationId, job: { managerId: managerId } },
      include: { user: true, job: true }
    });

    if (!application) return res.status(404).json({ message: 'Application not found or access denied.' });

    await prisma.message.create({
      data: {
        content: content || "Thank you for your patience while we review your profile.",
        isFromManager: true,
        applicationId
      }
    });

    await prisma.activityLog.create({
      data: { action: 'Sent a message to the candidate', applicationId, actorId: managerId }
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
});

export default router;
