import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

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

// GET all jobs for the logged in manager
router.get('/', async (req: any, res: any) => {
  try {
    const managerId = req.user.id;
    const jobs = await prisma.job.findMany({
      where: { managerId },
      include: {
        _count: {
          select: { applications: true }
        },
        applications: {
          select: { stage: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a new job
router.post('/', async (req: any, res: any) => {
  try {
    const managerId = req.user.id;
    const { 
      title, company, location, type, salary, description, 
      aboutCompany, keyResponsibilities, skillsNeeded, benefits,
      status, hiringSteps 
    } = req.body;
    
    const job = await prisma.job.create({
      data: {
        managerId,
        title,
        company,
        location,
        type,
        salary,
        description,
        aboutCompany,
        keyResponsibilities,
        skillsNeeded,
        benefits,
        status: status || 'PUBLISHED',
        hiringSteps: hiringSteps || ["Applied", "Screening", "Interview", "Offer"]
      }
    });
    
    res.status(201).json({ message: 'Job created', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update an existing job
router.put('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    const updates = req.body;
    
    // Ensure job belongs to manager
    const existingJob = await prisma.job.findFirst({
      where: { id, managerId }
    });
    
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    const job = await prisma.job.update({
      where: { id },
      data: updates
    });
    
    res.json({ message: 'Job updated', job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST duplicate a job
router.post('/:id/duplicate', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;
    
    const existingJob = await prisma.job.findFirst({
      where: { id, managerId }
    });
    
    if (!existingJob) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Create new job based on old job
    const newJob = await prisma.job.create({
      data: {
        managerId,
        title: `${existingJob.title} (Copy)`,
        company: existingJob.company,
        location: existingJob.location,
        type: existingJob.type,
        salary: existingJob.salary,
        description: existingJob.description,
        status: 'DRAFT', // Always copy as draft
        hiringSteps: existingJob.hiringSteps ? (existingJob.hiringSteps as any) : undefined
      }
    });
    
    res.status(201).json({ message: 'Job duplicated', job: newJob });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
