const pdfParse = require('pdf-parse');

export interface AtsScoreResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

export const calculateAtsScore = async (
  resumeBuffer: Buffer | string,
  resumeMimeType: string,
  jobData: {
    title?: string | null;
    skillsNeeded?: string | null;
    description?: string | null;
    keyResponsibilities?: string | null;
  }
): Promise<AtsScoreResult> => {
  let resumeText = '';

  // Extract text from resume
  if (Buffer.isBuffer(resumeBuffer)) {
    if (resumeMimeType === 'application/pdf') {
      try {
        const data = await pdfParse(resumeBuffer);
        resumeText = data.text;
      } catch (err) {
        console.error('Failed to parse PDF resume:', err);
        resumeText = ''; // Fallback
      }
    } else {
      // Assuming it's plain text if not PDF for now
      resumeText = resumeBuffer.toString('utf-8');
    }
  } else {
    // If it's already a string
    resumeText = resumeBuffer;
  }

  // If we still have no text, return early
  if (!resumeText.trim()) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: ['Resume text could not be extracted'],
      suggestions: ['Please upload a readable PDF or text resume.'],
    };
  }

  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const normalizedResume = normalize(resumeText);

  // Extract required skills / keywords from job
  const jobKeywordsText = [
    jobData.title,
    jobData.skillsNeeded,
    jobData.keyResponsibilities,
  ]
    .filter(Boolean)
    .join(' ');

  const normalizedJobText = normalize(jobKeywordsText);
  
  // Basic tokenization: split by spaces and filter out common stop words
  const stopWords = new Set(['and', 'or', 'the', 'is', 'in', 'to', 'with', 'for', 'of', 'a', 'an', 'on', 'as', 'by', 'are']);
  const rawKeywords = normalizedJobText.split(/\s+/).filter((w) => w.length > 2 && !stopWords.has(w));
  
  // Create a unique set of job keywords (we could use a more advanced TF-IDF approach, but this is a solid baseline)
  const jobKeywords = Array.from(new Set(rawKeywords));

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  // 1. Keyword Match (50 points)
  let keywordScore = 0;
  if (jobKeywords.length > 0) {
    jobKeywords.forEach((kw) => {
      // We look for word boundaries around the keyword
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(normalizedResume)) {
        matchedKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRatio = matchedKeywords.length / jobKeywords.length;
    keywordScore = Math.round(matchRatio * 50);
  } else {
    keywordScore = 50; // Give full points if no keywords are specified
  }

  // 2. Title/Role Relevance Match (20 points)
  let titleScore = 0;
  if (jobData.title) {
    const jobTitleTokens = normalize(jobData.title).split(/\s+/).filter(w => w.length > 2);
    let matchedTitleTokens = 0;
    jobTitleTokens.forEach(token => {
      const regex = new RegExp(`\\b${token}\\b`, 'i');
      if (regex.test(normalizedResume)) {
        matchedTitleTokens++;
      }
    });
    const titleMatchRatio = jobTitleTokens.length > 0 ? matchedTitleTokens / jobTitleTokens.length : 1;
    titleScore = Math.round(titleMatchRatio * 20);
  } else {
    titleScore = 20;
  }

  // 3. Experience Match (20 points)
  // Simple heuristic: look for words like "experience", "years", "senior"
  let experienceScore = 0;
  const expRegex = /\b(?:experience|years|senior|lead|manager)\b/i;
  if (expRegex.test(normalizedResume)) {
    experienceScore = 20;
  } else {
    experienceScore = 10; // Base score, might be junior
  }

  // 4. Education Match (10 points)
  // Simple heuristic: look for words like "degree", "university", "college", "bachelor", "master", "phd"
  let eduScore = 0;
  const eduRegex = /\b(?:degree|university|college|bachelor|master|phd|bsc|btech|mtech)\b/i;
  if (eduRegex.test(normalizedResume)) {
    eduScore = 10;
  } else {
    eduScore = 0;
  }

  const finalScore = keywordScore + titleScore + experienceScore + eduScore;

  // Generate Suggestions
  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding these missing keywords if you have the experience: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }
  if (titleScore < 10 && jobData.title) {
    suggestions.push(`Make sure your resume highlights experience relevant to a ${jobData.title} role.`);
  }
  if (eduScore === 0) {
    suggestions.push(`If applicable, add an Education section mentioning your degree or university.`);
  }

  return {
    score: Math.min(finalScore, 100),
    matchedKeywords: matchedKeywords.slice(0, 15), // Keep it reasonable for UI
    missingKeywords: missingKeywords.slice(0, 15),
    suggestions,
  };
};
