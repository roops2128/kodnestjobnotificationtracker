import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs, type Job } from "@/data/jobs";
import { loadPreferences, computeMatchScore, scoreBadgeVariant, type Preferences } from "@/lib/preferences";
import { toast } from "@/hooks/use-toast";
import { ExternalLink, Sparkles, Copy, Mail, MapPin, Bookmark, BookmarkCheck } from "lucide-react";

const DIGEST_PREFIX = "jobTrackerDigest_";
const SAVED_KEY = "jnt_saved_jobs";

const todayKey = () => {
  const d = new Date();
  return `${DIGEST_PREFIX}${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const formatDate = () =>
  new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

interface DigestEntry {
  id: number;
  title: string;
  company: string;
  location: string;
  experience: string;
  matchScore: number;
  applyUrl: string;
}

const getSaved = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") as number[];
  } catch {
    return [];
  }
};

const toggleSave = (id: number): number[] => {
  const current = getSaved();
  const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
};

const createMockJobs = (): Job[] =>
  Array.from({ length: 10 }, (_, index) => ({
    id: 9000 + index,
    title: `Software Engineer Intern ${index + 1}`,
    company: ["NovaStack Labs", "ByteSprint", "CodeOrbit", "CloudNest"][index % 4],
    location: ["Bangalore", "Hyderabad", "Pune", "Chennai"][index % 4],
    mode: ["Remote", "Hybrid", "Onsite"][index % 3] as Job["mode"],
    experience: ["Fresher", "0-1", "1-3"][index % 3] as Job["experience"],
    skills: ["React", "TypeScript", "Node.js"],
    source: ["LinkedIn", "Naukri", "Indeed"][index % 3] as Job["source"],
    postedDaysAgo: index % 5,
    salaryRange: "3–5 LPA",
    applyUrl: `https://jobs.example.com/apply/${9000 + index}`,
    description:
      "Join a product-focused engineering team and ship real features from day one.\n\nWork closely with mentors on frontend and backend modules.\n\nStrong fundamentals in JavaScript and problem solving are preferred.",
  }));

const loadDigest = (): DigestEntry[] | null => {
  try {
    const raw = localStorage.getItem(todayKey());
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DigestEntry[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
};

const buildDigestStrict = (sourceJobs: Job[], prefs: Preferences): DigestEntry[] => {
  const scored = sourceJobs.map(job => ({
    job,
    score: computeMatchScore(job, prefs),
  }));

  const matches = scored
    .filter(({ score }) => score >= prefs.minMatchScore)
    .sort((a, b) => b.score - a.score || a.job.postedDaysAgo - b.job.postedDaysAgo)
    .slice(0, 10);

  return matches.map(({ job, score }) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    experience: job.experience,
    matchScore: score,
    applyUrl: job.applyUrl,
  }));
};

const buildDigest = (sourceJobs: Job[], prefs: ReturnType<typeof loadPreferences>) => {
  const scored = sourceJobs.map(job => ({
    job,
    score: prefs ? computeMatchScore(job, prefs) : 0,
  }));

  const selected = [...scored]
    .sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo)
    .slice(0, 10);

  return selected.map(({ job, score }) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    experience: job.experience,
    matchScore: score,
    applyUrl: job.applyUrl,
  }));
};

const Digest = () => {
  const prefs = useMemo(() => loadPreferences(), []);
  const [digest, setDigest] = useState<DigestEntry[] | null>(() => loadDigest());
  const [noMatches, setNoMatches] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>(() => getSaved());

  const generate = useCallback(() => {
    const existing = loadDigest();
    if (existing) {
      setDigest(existing);
      setNoMatches(existing.length === 0);
      toast({ description: "Loaded today's existing digest." });
      return;
    }

    const pool = jobs.length > 0 ? jobs : createMockJobs();
    const nextDigest = prefs ? buildDigestStrict(pool, prefs) : buildDigest(pool, prefs);

    localStorage.setItem(todayKey(), JSON.stringify(nextDigest));
    setDigest(nextDigest);
    setNoMatches(nextDigest.length === 0);
    toast({ description: nextDigest.length > 0 ? "Digest generated for today." : "No matching roles found." });
  }, [prefs]);

  const digestText = useMemo(() => {
    if (!digest || digest.length === 0) return "";
    return [
      "Top 10 Jobs For You — 9AM Digest",
      formatDate(),
      "",
      ...digest.map(
        (d, i) =>
          `${i + 1}. ${d.title} at ${d.company}\n   ${d.location} · ${d.experience}${prefs ? ` · ${d.matchScore}% match` : ""}\n   Apply: ${d.applyUrl}`,
      ),
      "",
      "Generated based on your preferences and latest job feed.",
    ].join("\n");
  }, [digest, prefs]);

  const copyDigest = useCallback(() => {
    navigator.clipboard.writeText(digestText);
    toast({ description: "Digest copied to clipboard." });
  }, [digestText]);

  const emailDigest = useCallback(() => {
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [digestText]);

  const handleSave = useCallback((id: number) => {
    const next = toggleSave(id);
    setSavedIds(next);
    toast({ description: next.includes(id) ? "Job saved" : "Job removed from saved" });
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full bg-muted/20 rounded-lg">
      {!prefs && !digest && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-medium">Set preferences to generate a personalized digest.</p>
        </div>
      )}

      {prefs && !digest && (
        <div className="text-center mb-6">
          <Button size="lg" onClick={generate} className="gap-2">
            <Sparkles className="h-4 w-4" /> Generate Today&apos;s 9AM Digest (Simulated)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      )}

      {digest && noMatches && (
        <div className="text-center py-12">
          <p className="text-muted-foreground font-medium">No matching roles today. Check again tomorrow.</p>
        </div>
      )}

      {digest && digest.length > 0 && (
        <Card className="bg-card shadow-lg">
          <CardHeader className="text-center border-b pb-4">
            <CardTitle className="text-xl md:text-2xl">Top 10 Jobs For You — 9AM Digest</CardTitle>
            <CardDescription>{formatDate()}</CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            {digest.map((d, i) => {
              const isSaved = savedIds.includes(d.id);
              return (
                <div key={d.id} className="flex items-start justify-between gap-3 border-b last:border-0 pb-3 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-serif font-semibold text-sm leading-tight">
                      {i + 1}. {d.title}
                    </p>
                    <p className="text-xs text-foreground/80">{d.company}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {d.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {prefs && <Badge variant={scoreBadgeVariant(d.matchScore)}>{d.matchScore}%</Badge>}
                    <Button variant="ghost" size="sm" asChild>
                      <a href={d.applyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Apply
                      </a>
                    </Button>
                    <Button variant={isSaved ? "default" : "secondary"} size="sm" onClick={() => handleSave(d.id)} className="gap-1">
                      {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>

          <CardFooter className="flex-col gap-3 border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">This digest was generated based on your preferences.</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={copyDigest} className="gap-1">
                <Copy className="h-3.5 w-3.5" /> Copy Digest
              </Button>
              <Button variant="secondary" size="sm" onClick={emailDigest} className="gap-1">
                <Mail className="h-3.5 w-3.5" /> Create Email Draft
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Demo Mode: Daily 9AM trigger simulated manually.</p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Digest;
