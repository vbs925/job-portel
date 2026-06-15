import { Router } from 'express';
import { enhanceJobDescription, compareCandidates } from '../lib/ai';
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';

// Middleware to ensure user is a MANAGER
const isManager = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'MANAGER') {
    return res.status(403).json({ message: 'Access denied. Managers only.' });
  }
  next();
};

const router = Router();

// Endpoint to enhance JD draft
router.post('/enhance-jd', authenticate, isManager, async (req, res) => {
  try {
    const draft = req.body;
    const enhancedJD = await enhanceJobDescription(draft);
    res.json(enhancedJD);
  } catch (error: any) {
    console.error("Enhance JD Error:", error);
    res.status(500).json({ error: "Failed to enhance job description", details: error.message });
  }
});

// Endpoint to compare candidates
router.post('/compare-candidates', authenticate, isManager, async (req, res) => {
  try {
    const { jobTitle, applicantIds } = req.body;
    
    if (!jobTitle || !applicantIds || !Array.isArray(applicantIds) || applicantIds.length < 2) {
      return res.status(400).json({ error: "Job title and at least two applicant IDs are required." });
    }

    // Fetch the applicants and their user profiles
    const applicants = await prisma.application.findMany({
      where: {
        id: { in: applicantIds },
      },
      include: {
        user: true,
      }
    });

    // Map to a cleaner format for the AI
    const candidates = applicants.map(app => ({
      name: app.user.name,
      skills: app.user.skills,
      experience: app.user.experience,
      education: app.user.education,
      locationPreference: app.user.locationPreference,
    }));

    const comparisonReport = await compareCandidates(jobTitle, candidates);
    
    res.json({ report: comparisonReport });
  } catch (error: any) {
    console.error("Compare Candidates Error:", error);
    res.status(500).json({ error: "Failed to compare candidates", details: error.message });
  }
});

export default router;
