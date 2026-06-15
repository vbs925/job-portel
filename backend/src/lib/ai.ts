import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn("GEMINI_API_KEY is missing. AI features will be disabled.");
}

export const enhanceJobDescription = async (draft: any) => {
  if (!ai) throw new Error("AI is not configured");

  const prompt = `
You are an expert HR recruiter. Please enhance the following raw notes into a professional job description.
Return ONLY a JSON object with the following keys:
- description: A compelling, professional 2-3 paragraph overview of the role.
- keyResponsibilities: A bulleted list (using '-' or '•') of 5-7 clear responsibilities based on the notes.
- skillsNeeded: A bulleted list of 5-7 required and nice-to-have skills/qualifications.
- aboutCompany: A polished 1-2 paragraph pitch about the company culture and mission (if provided, expand on it. If not, write a generic tech company placeholder).
- benefits: A bulleted list of perks and benefits.

Raw Notes:
Title: ${draft.title || 'N/A'}
Company: ${draft.company || 'N/A'}
About Company Draft: ${draft.aboutCompany || 'N/A'}
Description Draft: ${draft.description || 'N/A'}
Responsibilities Draft: ${draft.keyResponsibilities || 'N/A'}
Skills Draft: ${draft.skillsNeeded || 'N/A'}
Benefits Draft: ${draft.benefits || 'N/A'}

Format the output strictly as JSON, with no markdown wrapping like \`\`\`json.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    let text = response.text || '';
    // Strip markdown formatting if the model still outputs it
    text = text.replace(/^```json/g, '').replace(/^```/g, '').replace(/```$/g, '').trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI JD Generation failed:", error);
    throw new Error("Failed to generate job description");
  }
};

export const compareCandidates = async (jobTitle: string, candidates: any[]) => {
  if (!ai) throw new Error("AI is not configured");

  const candidatesData = candidates.map(c => ({
    name: c.name || 'Unknown',
    skills: c.skills || 'Not specified',
    experience: c.experience || 'Not specified',
    education: c.education || 'Not specified',
    location: c.locationPreference || 'Not specified',
  }));

  const prompt = `
You are an expert technical recruiter and hiring manager.
Please compare the following candidates for the role of "${jobTitle}".

Candidates Data:
${JSON.stringify(candidatesData, null, 2)}

Provide a detailed, comparative analysis in Markdown format. Structure it nicely with:
1. An Executive Summary (who stands out and why).
2. A side-by-side strengths & weaknesses breakdown for each candidate.
3. A Final Recommendation on who might be the best fit.
Do not use raw JSON. Use readable Markdown with headers (##, ###) and bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("AI Candidate Comparison failed:", error);
    throw new Error("Failed to compare candidates");
  }
};
