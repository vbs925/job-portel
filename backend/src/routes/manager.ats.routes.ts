import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { sendOfferEmail, sendRejectionEmail, sendStageUpdateEmail } from '../lib/email';

// Middleware to ensure user is a MANAGER
const isManager = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'MANAGER') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

// Apply to all routes in this file
router.use(authenticate);
router.use(isManager);

// GET all applications for a manager's jobs, or filter by specific job
router.get('/', async (req: any, res: any) => {
  try {
    const managerId = req.user.id;
    const { jobId } = req.query;
    
    // First find all jobs this manager owns to ensure they have access
    const managerJobs = await prisma.job.findMany({
      where: { managerId },
      select: { id: true }
    });
    
    const managerJobIds = managerJobs.map((j: any) => j.id);
    
    let whereClause: any = {
      jobId: { in: managerJobIds }
    };
    
    if (jobId) {
      if (!managerJobIds.includes(jobId)) {
        return res.status(403).json({ message: 'You do not have access to this job' });
      }
      whereClause.jobId = jobId;
    }
    
    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, skills: true, certificates: true, education: true, experience: true, locationPreference: true }
        },
        job: {
          select: { id: true, title: true, hiringSteps: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single application details
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, education: true, experience: true, skills: true, certificates: true, locationPreference: true } },
        job: true,
        interviews: true,
        messages: { orderBy: { createdAt: 'asc' } },
        activities: { orderBy: { createdAt: 'desc' }, include: { application: true } }
      }
    });
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT move applicant through stages
router.put('/:id/stage', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;
    const managerId = req.user.id;
    
    const app = await prisma.application.update({
      where: { id },
      data: { stage },
      include: { user: true, job: true }
    });
    
    // Log activity
    await prisma.activityLog.create({
      data: {
        applicationId: id,
        action: `Moved to ${stage}`,
        actorId: managerId
      }
    });
    
    // Optionally create a message to trigger communication
    await prisma.message.create({
      data: {
        applicationId: id,
        isFromManager: true,
        content: `Your application stage has been updated to: ${stage}`
      }
    });

    // Send email notification based on stage
    if (app.user?.email && app.job?.title) {
      if (stage === 'Offer') {
        await sendOfferEmail(app.user.email, app.user.name || 'Applicant', app.job.title, app.job.company);
      } else if (stage === 'Rejected') {
        await sendRejectionEmail(app.user.email, app.user.name || 'Applicant', app.job.title);
      } else {
        await sendStageUpdateEmail(app.user.email, app.user.name || 'Applicant', app.job.title, stage);
      }
    }
    
    res.json({ message: 'Stage updated successfully', application: app });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT bulk stage update
router.put('/bulk-stage', async (req: any, res: any) => {
  try {
    const { applicationIds, stage } = req.body;
    const managerId = req.user.id;
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ message: 'Please provide applicationIds array' });
    }
    
    // Perform bulk update in a transaction
    const updateResult = await prisma.$transaction(async (tx: any) => {
      // 1. Update all stages
      const updated = await tx.application.updateMany({
        where: { id: { in: applicationIds } },
        data: { stage }
      });
      
      // 2. Create activity logs
      const logs = applicationIds.map(id => ({
        applicationId: id,
        action: `Bulk moved to ${stage}`,
        actorId: managerId
      }));
      await tx.activityLog.createMany({ data: logs });
      
      return updated;
    });
    
    res.json({ message: `Successfully updated ${updateResult.count} applications`, count: updateResult.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
