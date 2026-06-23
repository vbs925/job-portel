import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { sendApplicationConfirmationEmail, sendRejectionEmail } from '../lib/email';
import { calculateAtsScore } from '../services/atsScoreService';
// Apply for a job
router.post('/', authenticate, upload.single('resume'), async (req: any, res: any) => {
  try {
    const { jobId, phone, coverLetter, skills, experience, profileResumeUrl } = req.body;
    const userId = req.user.id;
    const file = req.file;
    let resumeUrl = null;
    let resumeBuffer = null;
    let resumeMimetype = null;

    if (file) {
      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          mimetype: file.mimetype,
          data: file.buffer
        }
      });
      resumeUrl = `/api/files/${document.id}`;
      resumeBuffer = file.buffer;
      resumeMimetype = file.mimetype;
    } else if (profileResumeUrl) {
      const docId = profileResumeUrl.split('/').pop();
      if (docId) {
        const document = await prisma.document.findUnique({ where: { id: docId } });
        if (document) {
          resumeUrl = profileResumeUrl;
          resumeBuffer = document.data;
          resumeMimetype = document.mimetype;
        }
      }
    }
    
    // Create application
    const application = await prisma.application.create({
      data: {
        userId,
        jobId: jobId || null, // Allow null for general application
        phone: phone || null,
        coverLetter: coverLetter || null,
        skills: skills || null,
        experience: experience || null,
        resumeUrl
      },
      include: {
        user: true,
        job: true
      }
    });

    // Calculate ATS Score if resume buffer exists
    if (resumeBuffer && application.job) {
      const jobData = {
        title: application.job.title,
        skillsNeeded: application.job.skillsNeeded,
        description: application.job.description,
        keyResponsibilities: application.job.keyResponsibilities
      };
      
      try {
        const atsResult = await calculateAtsScore(resumeBuffer, resumeMimetype || 'application/pdf', jobData);
        
        // Save the ATS Score but keep stage as "In Progress" for delayed processing
        await prisma.application.update({
          where: { id: application.id },
          data: {
            atsScore: atsResult.score,
            matchedKeywords: atsResult.matchedKeywords,
            missingKeywords: atsResult.missingKeywords,
            atsSuggestions: atsResult.suggestions,
            stage: 'In Progress'
          }
        });
      } catch (atsErr) {
        console.error("Failed to calculate ATS score automatically:", atsErr);
        // Ensure stage is "In Progress" even if ATS fails
        await prisma.application.update({
          where: { id: application.id },
          data: { stage: 'In Progress' }
        });
      }
    } else {
      // If no file, still set stage to "In Progress"
      await prisma.application.update({
        where: { id: application.id },
        data: { stage: 'In Progress' }
      });
    }
    
    // Always send the confirmation email immediately
    if (application.user && application.user.email && application.job && application.job.title) {
      await sendApplicationConfirmationEmail(application.user.email, application.user.name || 'Applicant', application.job.title);
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

// Update an existing application
router.put('/:id', authenticate, upload.single('resume'), async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { phone, coverLetter, skills, experience, profileResumeUrl } = req.body;
    const userId = req.user.id;
    const file = req.file;

    // Verify ownership
    const existingApplication = await prisma.application.findUnique({
      where: { id },
      include: { job: true }
    });

    if (!existingApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (existingApplication.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this application' });
    }

    let resumeUrl = existingApplication.resumeUrl;
    let resumeBuffer = null;
    let resumeMimetype = null;

    if (file) {
      const document = await prisma.document.create({
        data: {
          filename: file.originalname,
          mimetype: file.mimetype,
          data: file.buffer
        }
      });
      resumeUrl = `/api/files/${document.id}`;
      resumeBuffer = file.buffer;
      resumeMimetype = file.mimetype;
    } else if (profileResumeUrl && profileResumeUrl !== resumeUrl) {
      const docId = profileResumeUrl.split('/').pop();
      if (docId) {
        const document = await prisma.document.findUnique({ where: { id: docId } });
        if (document) {
          resumeUrl = profileResumeUrl;
          resumeBuffer = document.data;
          resumeMimetype = document.mimetype;
        }
      }
    }

    // Update application
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        phone: phone !== undefined ? phone : existingApplication.phone,
        coverLetter: coverLetter !== undefined ? coverLetter : existingApplication.coverLetter,
        skills: skills !== undefined ? skills : existingApplication.skills,
        experience: experience !== undefined ? experience : existingApplication.experience,
        resumeUrl
      }
    });

    // If new resume was uploaded, recalculate ATS score
    if (resumeBuffer && existingApplication.job) {
      const jobData = {
        title: existingApplication.job.title,
        skillsNeeded: existingApplication.job.skillsNeeded,
        description: existingApplication.job.description,
        keyResponsibilities: existingApplication.job.keyResponsibilities
      };
      
      try {
        const atsResult = await calculateAtsScore(resumeBuffer, resumeMimetype || 'application/pdf', jobData);
        
        await prisma.application.update({
          where: { id },
          data: {
            atsScore: atsResult.score,
            matchedKeywords: atsResult.matchedKeywords,
            missingKeywords: atsResult.missingKeywords,
            atsSuggestions: atsResult.suggestions
          }
        });
      } catch (atsErr) {
        console.error("Failed to calculate ATS score automatically on edit:", atsErr);
      }
    }

    res.json({ message: 'Application updated successfully', application: updatedApplication });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
