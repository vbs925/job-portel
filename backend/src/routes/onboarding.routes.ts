import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticate } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = express.Router();

router.use(authenticate);

const SYSTEM_PROMPT = `You are Aria, a warm, encouraging, and insightful AI career counselor helping a new job seeker build their profile on a modern job portal. Your tone is friendly, conversational, and professional — like a smart friend who works in HR.

You guide the user through exactly 6 steps in this strict order:
1. ROLE      — Understand what type of role/career field they're looking for
2. BACKGROUND — Ask 2-3 targeted follow-up questions about their experience level, what they've built/done, their goals
3. SKILLS    — Based on their role and background, suggest a curated list of relevant skills (return as suggestedSkills array), and ask them to pick and add their own
4. EXPERIENCE — Ask about their work history: companies, job titles, how long they worked there
5. EDUCATION — Ask about educational background: degree, institution, graduation year, field of study
6. INTERESTS — Ask about personal hobbies and interests outside of their career (this helps with culture fit)

CRITICAL RULES:
- Ask only ONE question or two short questions at a time. Never overwhelm the user.
- Be encouraging and acknowledge what they say before moving to the next question.
- After collecting enough info for a step (usually after 1-2 user replies), move to the next step.
- On the SKILLS step, ALWAYS return a "suggestedSkills" array with 8-12 relevant skills based on their role/background.
- Extract and accumulate structured data from the conversation into "extractedData".
- Set "isComplete" to true ONLY after you have gathered interests (step 6) and said a warm goodbye message.
- ALWAYS respond with ONLY a valid JSON object — no markdown, no code blocks, no extra text.

extractedData schema (fill progressively as you learn):
{
  "targetRole": "string",
  "experienceLevel": "string (e.g. Fresher, Junior, Mid, Senior)",
  "background": "string (summary of their background)",
  "skills": ["array", "of", "skills"],
  "experience": [{ "company": "string", "role": "string", "duration": "string", "description": "string" }],
  "education": [{ "institution": "string", "degree": "string", "field": "string", "year": "string" }],
  "interests": ["array", "of", "interests"],
  "locationPreference": "string or null"
}

Your JSON response format (ALWAYS follow this exactly):
{
  "message": "Your conversational message to the user",
  "step": "role|background|skills|experience|education|interests|complete",
  "suggestedSkills": [],
  "extractedData": {},
  "isComplete": false
}`;

// POST /api/onboarding/chat
router.post('/chat', async (req: any, res: any) => {
  try {
    const { history, userMessage, currentStep } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'AI service not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build conversation for the model
    const conversationContext = history
      ? history.map((msg: any) => `${msg.role === 'ai' ? 'Aria' : 'User'}: ${msg.content}`).join('\n')
      : '';

    const fullPrompt = `${SYSTEM_PROMPT}

--- CONVERSATION SO FAR ---
${conversationContext || 'This is the very start of the conversation. Greet the user warmly as Aria and ask your first question about what role they are looking for.'}
${userMessage ? `\nUser: ${userMessage}` : ''}

--- CURRENT STEP CONTEXT ---
Current step: ${currentStep || 'start'}

Now respond as Aria. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    const rawText = (response.text || '').trim();

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse Gemini JSON:', rawText);
      return res.status(500).json({ message: 'AI response parsing error. Please try again.' });
    }

    return res.json(parsed);
  } catch (error) {
    console.error('Onboarding chat error:', error);
    res.status(500).json({ message: 'Server error during onboarding chat' });
  }
});

// POST /api/onboarding/complete
// Saves the profile and returns matched jobs
router.post('/complete', async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const { extractedData } = req.body;

    if (!extractedData) {
      return res.status(400).json({ message: 'No extracted data provided' });
    }

    const {
      skills,
      experience,
      education,
      interests,
      targetRole,
      experienceLevel,
      background,
      locationPreference,
    } = extractedData;

    // ── Step 1: Save profile to DB ──────────────────────────────────────────
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          skills: Array.isArray(skills) && skills.length > 0 ? skills : undefined,
          experience: Array.isArray(experience) && experience.length > 0 ? experience : undefined,
          education: Array.isArray(education) && education.length > 0 ? education : undefined,
          locationPreference: locationPreference || undefined,
          // Store interests + role context in portfolio field as JSON blob
          portfolio: {
            interests: interests || [],
            targetRole: targetRole || '',
            experienceLevel: experienceLevel || '',
            background: background || '',
          },
        },
      });
    } catch (dbError) {
      console.error('Prisma update error:', dbError);
      return res.status(500).json({ message: 'Failed to save profile to database' });
    }

    // ── Step 2: Fetch published jobs ────────────────────────────────────────
    let jobs: any[] = [];
    try {
      jobs = await prisma.job.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbError) {
      console.error('Job fetch error:', dbError);
      // Profile is saved, just return empty jobs
      return res.json({ message: 'Profile saved', matchedJobs: [] });
    }

    if (jobs.length === 0) {
      return res.json({ message: 'Profile saved', matchedJobs: [] });
    }

    // ── Step 3: AI matching (graceful fallback if it fails) ─────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ message: 'Profile saved', matchedJobs: jobs.slice(0, 4) });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const matchPrompt = `You are an expert job matcher. Given a candidate profile and a list of available jobs, return the IDs of the top 4 most suitable jobs.

Candidate Profile:
- Target Role: ${targetRole || 'Not specified'}
- Experience Level: ${experienceLevel || 'Not specified'}
- Background: ${background || 'Not specified'}
- Skills: ${JSON.stringify(skills || [])}
- Interests: ${JSON.stringify(interests || [])}

Available Jobs (ID | Title | Company | Skills Required):
${jobs.map((j) => `${j.id} | ${j.title} | ${j.company} | ${j.skillsNeeded || ''}`).join('\n')}

Return ONLY a JSON array of exactly 4 job IDs. Example: ["id1", "id2", "id3", "id4"]. No markdown, no explanation.`;

      const matchResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: matchPrompt,
      });

      const matchText = (matchResponse.text || '').trim();
      let matchedIds: string[] = [];

      try {
        matchedIds = JSON.parse(matchText.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        console.warn('Failed to parse Gemini match response, using fallback');
        matchedIds = [];
      }

      const matchedJobs = jobs.filter((j) => matchedIds.includes(j.id));
      const finalJobs = matchedJobs.length > 0 ? matchedJobs : jobs.slice(0, 4);

      return res.json({ message: 'Profile saved and jobs matched', matchedJobs: finalJobs });
    } catch (aiError) {
      // AI matching failed — still return profile saved with recent jobs as fallback
      console.error('Gemini matching error (non-fatal):', aiError);
      return res.json({ message: 'Profile saved', matchedJobs: jobs.slice(0, 4) });
    }
  } catch (error) {
    console.error('Onboarding complete unexpected error:', error);
    res.status(500).json({ message: 'Unexpected server error' });
  }
});

export default router;
