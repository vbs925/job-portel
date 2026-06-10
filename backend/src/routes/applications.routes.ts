import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { sendApplicationConfirmationEmail } from '../lib/email';

// Apply for a job
router.post('/', authenticate, upload.single('resume'), async (req: any, res: any) => {
  try {
    const { jobId, phone, coverLetter, skills, experience } = req.body;
    const userId = req.user.id;
    const file = req.file;
    
    // Create application
    const application = await prisma.application.create({
      data: {
        userId,
        jobId: jobId || null, // Allow null for general application
        phone: phone || null,
        coverLetter: coverLetter || null,
        skills: skills || null,
        experience: experience || null,
        resumeUrl: file ? `/uploads/${file.filename}` : null
      },
      include: {
        user: true,
        job: true
      }
    });
    
    // Fire and forget email
    if (application.user && application.user.email && application.job && application.job.title) {
      sendApplicationConfirmationEmail(application.user.email, application.user.name || 'Applicant', application.job.title);
    }
    
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'You have already applied for this position' });
    }
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get user's applications
router.get('/me', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: true,
        interviews: true,
        messages: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
