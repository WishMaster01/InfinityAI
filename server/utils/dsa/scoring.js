import { PriorityQueue } from "./priorityQueue.js";
import { cosineSimilarity, kmpSearch } from "./similarity.js";
import { tokenize } from "./textAnalysis.js";

const DEFAULT_SKILLS = [
  "javascript", "typescript", "react", "node.js", "express", "python",
  "java", "c++", "c#", "sql", "postgresql", "mysql", "mongodb", "redis",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "git",
  "rest api", "graphql", "machine learning", "deep learning", "nlp",
  "data analysis", "system design", "agile", "leadership", "communication",
  "project management", "figma", "seo", "salesforce", "excel",
];

const hasPhrase = (text, phrase) => {
  const normalized = String(text || "").toLowerCase();
  let index = kmpSearch(normalized, phrase.toLowerCase());
  while (index >= 0) {
    const before = normalized[index - 1];
    const after = normalized[index + phrase.length];
    const boundaryBefore = !before || !/[a-z0-9+#]/.test(before);
    const boundaryAfter = !after || !/[a-z0-9+#]/.test(after);
    if (boundaryBefore && boundaryAfter) return true;
    const next = kmpSearch(normalized.slice(index + 1), phrase.toLowerCase());
    index = next < 0 ? -1 : index + 1 + next;
  }
  return false;
};

export const scoreResume = (
  resumeText,
  jobDescription = "",
  { skills = DEFAULT_SKILLS } = {},
) => {
  const resume = String(resumeText || "");
  const job = String(jobDescription || "");
  const requiredSkills = skills.filter((skill) => hasPhrase(job, skill));
  const resumeSkills = skills.filter((skill) => hasPhrase(resume, skill));
  const matchedSkills = requiredSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = requiredSkills.filter((skill) => !resumeSkills.includes(skill));
  const keywordScore = requiredSkills.length
    ? (matchedSkills.length / requiredSkills.length) * 100
    : Math.min(100, resumeSkills.length * 8 + 40);
  const similarityScore = job ? cosineSimilarity(resume, job) * 100 : keywordScore;
  const sections = {
    contact: /(?:@|\b(?:phone|email|linkedin)\b)/i.test(resume),
    summary: /\b(?:summary|profile|objective)\b/i.test(resume),
    experience: /\b(?:experience|employment|work history)\b/i.test(resume),
    education: /\b(?:education|academic|degree)\b/i.test(resume),
    skills: /\b(?:skills|technologies|competencies)\b/i.test(resume),
  };
  const sectionScore =
    (Object.values(sections).filter(Boolean).length / Object.keys(sections).length) * 100;
  const words = tokenize(resume).length;
  const formatScore = words >= 150 && words <= 1200 ? 100 : words >= 80 ? 70 : 35;
  const score = Math.round(
    keywordScore * 0.45 + similarityScore * 0.25 + sectionScore * 0.2 + formatScore * 0.1,
  );

  const suggestions = new PriorityQueue();
  if (missingSkills.length) {
    suggestions.enqueue({
      priority: 100,
      message: `Add evidence for relevant missing skills: ${missingSkills.slice(0, 8).join(", ")}.`,
    });
  }
  for (const [section, present] of Object.entries(sections)) {
    if (!present) suggestions.enqueue({ priority: 80, message: `Add a clear ${section} section.` });
  }
  if (words < 150) suggestions.enqueue({ priority: 70, message: "Add measurable achievements and role context." });
  if (words > 1200) suggestions.enqueue({ priority: 65, message: "Reduce length and remove low-value repetition." });
  if (!/\b\d+(?:[.,]\d+)?%?\b/.test(resume)) {
    suggestions.enqueue({ priority: 60, message: "Quantify outcomes with metrics where accurate." });
  }

  const rankedSuggestions = [];
  while (suggestions.size) rankedSuggestions.push(suggestions.dequeue().message);
  return {
    score: Math.max(0, Math.min(100, score)),
    matchedSkills,
    missingSkills,
    detectedSkills: resumeSkills,
    sectionScores: {
      keywords: Math.round(keywordScore),
      relevance: Math.round(similarityScore),
      structure: Math.round(sectionScore),
      length: Math.round(formatScore),
    },
    suggestions: rankedSuggestions,
  };
};

export const formatAtsReport = (analysis) => [
  "## Deterministic ATS analysis",
  `**ATS score: ${analysis.score}/100**`,
  `- Matched skills: ${analysis.matchedSkills.join(", ") || "No job-specific skills supplied"}`,
  `- Missing skills: ${analysis.missingSkills.join(", ") || "None detected"}`,
  `- Section scores: Keywords ${analysis.sectionScores.keywords}, Relevance ${analysis.sectionScores.relevance}, Structure ${analysis.sectionScores.structure}, Length ${analysis.sectionScores.length}`,
  "### Highest-priority improvements",
  ...(analysis.suggestions.length
    ? analysis.suggestions.map((suggestion) => `- ${suggestion}`)
    : ["- Resume passed the baseline structural checks."]),
].join("\n");
