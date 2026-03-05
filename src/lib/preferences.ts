import type { Job } from "@/data/jobs";

export interface Preferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

const PREF_KEY = "jobTrackerPreferences";

export const defaultPreferences: Preferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

export const loadPreferences = (): Preferences | null => {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Preferences;
  } catch {
    return null;
  }
};

export const savePreferences = (prefs: Preferences) => {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
};

/** Split comma-separated string into lowercase trimmed tokens */
const tokenize = (s: string): string[] =>
  s.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);

/**
 * Deterministic match score (0–100) per the specification:
 * +25 roleKeyword in title
 * +15 roleKeyword in description
 * +15 location match
 * +10 mode match
 * +10 experience match
 * +15 skill overlap
 * +5  postedDaysAgo <= 2
 * +5  source is LinkedIn
 */
export const computeMatchScore = (job: Job, prefs: Preferences): number => {
  let score = 0;
  const keywords = tokenize(prefs.roleKeywords);
  const userSkills = tokenize(prefs.skills);
  const titleLower = job.title.toLowerCase();
  const descLower = job.description.toLowerCase();

  if (keywords.length > 0) {
    if (keywords.some(kw => titleLower.includes(kw))) score += 25;
    if (keywords.some(kw => descLower.includes(kw))) score += 15;
  }

  if (prefs.preferredLocations.length > 0 && prefs.preferredLocations.includes(job.location)) {
    score += 15;
  }

  if (prefs.preferredMode.length > 0 && prefs.preferredMode.includes(job.mode)) {
    score += 10;
  }

  if (prefs.experienceLevel && job.experience === prefs.experienceLevel) {
    score += 10;
  }

  if (userSkills.length > 0) {
    const jobSkillsLower = job.skills.map(s => s.toLowerCase());
    if (userSkills.some(us => jobSkillsLower.includes(us))) score += 15;
  }

  if (job.postedDaysAgo <= 2) score += 5;
  if (job.source === "LinkedIn") score += 5;

  return Math.min(score, 100);
};

export const scoreBadgeVariant = (score: number) => {
  if (score >= 80) return "success" as const;
  if (score >= 60) return "warning" as const;
  if (score >= 40) return "secondary" as const;
  return "muted" as const;
};
