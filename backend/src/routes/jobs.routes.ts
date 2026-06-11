import express from 'express';
const router = express.Router();
import prisma from '../lib/prisma';
import { authenticate } from '../middleware/auth';
import { GoogleGenAI } from '@google/genai';

// Get all jobs (with optional search/filters)
router.get('/', async (req: any, res: any) => {
  try {
    const { search, location, type } = req.query;
    
    let andClauses: any[] = [];
    
    if (search) {
      andClauses.push({
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { company: { contains: String(search), mode: 'insensitive' } }
        ]
      });
    }
    
    if (location) {
      const locations = String(location).split(',');
      andClauses.push({
        OR: locations.map(loc => ({
          location: { contains: loc, mode: 'insensitive' }
        }))
      });
    }
    
    if (type) {
      const types = String(type).split(',');
      andClauses.push({
        type: { in: types }
      });
    }
    
    const whereClause = andClauses.length > 0 ? { AND: andClauses } : {};
    
    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI suggested jobs
router.get('/suggested', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobs = await prisma.job.findMany({ where: { status: 'PUBLISHED' }, orderBy: { createdAt: 'desc' } });
    if (jobs.length === 0) {
      return res.json([]);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(jobs.slice(0, 4));
    }

    // ── Gemini matching — graceful fallback if AI fails ─────────────────────
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Pull profile data from portfolio field (saved during onboarding)
      const profileMeta = (user.portfolio && typeof user.portfolio === 'object' && !Array.isArray(user.portfolio))
        ? user.portfolio as Record<string, any>
        : {};

      const prompt = `You are an AI job matcher.
Candidate Profile:
- Target Role: ${profileMeta.targetRole || 'Not specified'}
- Experience Level: ${profileMeta.experienceLevel || 'Not specified'}
- Skills: ${JSON.stringify(user.skills || [])}
- Interests: ${JSON.stringify(profileMeta.interests || [])}

Available Jobs:
${jobs.map(j => `ID: ${j.id} | Title: ${j.title} | Company: ${j.company} | Skills Needed: ${j.skillsNeeded || ''}`).join('\n')}

Return ONLY a JSON array of the 4 best matching job IDs. Example: ["id1","id2","id3","id4"]. No markdown, no explanations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = (response.text || '').trim();
      let matchedIds: string[] = [];

      try {
        matchedIds = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        console.warn('Failed to parse Gemini suggestions response, using fallback');
        matchedIds = [];
      }

      const matchedJobs = jobs.filter(j => matchedIds.includes(j.id));
      return res.json(matchedJobs.length > 0 ? matchedJobs : jobs.slice(0, 4));
    } catch (aiError) {
      // AI failed — return most recent jobs as a non-error fallback
      console.error('Gemini suggestions error (non-fatal):', aiError);
      return res.json(jobs.slice(0, 4));
    }
  } catch (error) {
    console.error('Suggested jobs unexpected error:', error);
    res.status(500).json({ message: 'Server error generating suggestions' });
  }
});

// Save a job (bookmark)
router.post('/:jobId/save', authenticate, async (req: any, res: any) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    
    // Check if already saved
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: { userId, jobId }
      }
    });
    
    if (existing) {
      // Unsave it
      await prisma.savedJob.delete({
        where: { id: existing.id }
      });
      return res.json({ message: 'Job unsaved successfully', isSaved: false });
    }
    
    // Save it
    await prisma.savedJob.create({
      data: { userId, jobId }
    });
    
    res.json({ message: 'Job saved successfully', isSaved: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's saved jobs
router.get('/saved', authenticate, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(savedJobs.map((sj: any) => sj.job));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
