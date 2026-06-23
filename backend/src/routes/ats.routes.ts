import express from 'express';
const router = express.Router();
import { upload } from '../middleware/upload';
import { calculateAtsScore } from '../services/atsScoreService';
import prisma from '../lib/prisma';

// POST /api/ats-score
// Accepts form-data with resumeFile and jobDescriptionId (or jobDescriptionText)
router.post('/', upload.single('resumeFile'), async (req: any, res: any) => {
  try {
    const file = req.file;
    const { jobDescriptionId, jobDescriptionText } = req.body;

    if (!file && !req.body.resumeText) {
      return res.status(400).json({ message: 'Missing resumeFile or resumeText' });
    }

    const resumeBuffer = file ? file.buffer : req.body.resumeText;
    const resumeMimeType = file ? file.mimetype : 'text/plain';

    let jobData: any = { description: jobDescriptionText || '' };

    // If a jobId is provided, fetch the job from the DB
    if (jobDescriptionId) {
      const job = await prisma.job.findUnique({
        where: { id: jobDescriptionId }
      });
      if (job) {
        jobData = {
          title: job.title,
          skillsNeeded: job.skillsNeeded,
          description: job.description,
          keyResponsibilities: job.keyResponsibilities
        };
      }
    }

    const atsResult = await calculateAtsScore(resumeBuffer, resumeMimeType, jobData);
    
    res.json(atsResult);
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
