import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs } from "@/data/jobs";
import { loadPreferences, computeMatchScore, scoreBadgeVariant } from "@/lib/preferences";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  ExternalLink, Sparkles, Copy, Mail, MapPin, Briefcase, AlertCircle, Inbox,
} from "lucide-react";

const todayKey = () => {
  const d = new Date();
  return `jobTrackerDigest_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

const loadDigest = (): DigestEntry[] | null => {
  try {
    const raw = localStorage.getItem(todayKey());
    return raw ? (JSON.parse(raw) as DigestEntry[]) : null;
  } catch { return null; }
};

const Digest = () => {
  const prefs = useMemo(() => loadPreferences(), []);
  const [digest, setDigest] = useState<DigestEntry[] | null>(() => loadDigest());

  const generate = useCallback(() => {
    if (!prefs) return;
    const existing = loadDigest();
    if (existing) { setDigest(existing); return; }

    const scored = jobs
      .map(j => ({ job: j, score: computeMatchScore(j, prefs) }))
      .filter(({ score }) => score >= prefs.minMatchScore)
      .sort((a, b) => b.score - a.score || a.job.postedDaysAgo - b.job.postedDaysAgo)
      .slice(0, 10)
      .map(({ job, score }) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        matchScore: score,
        applyUrl: job.applyUrl,
      }));

    localStorage.setItem(todayKey(), JSON.stringify(scored));
    setDigest(scored);
    toast({ description: "Digest generated for today." });
  }, [prefs]);

  const digestText = useMemo(() => {
    if (!digest || digest.length === 0) return "";
    return [
      `Top 10 Jobs For You — 9AM Digest`,
      formatDate(),
      "",
      ...digest.map((d, i) =>
        `${i + 1}. ${d.title} at ${d.company}\n   ${d.location} · ${d.experience} · ${d.matchScore}% match\n   Apply: ${d.applyUrl}`
      ),
      "",
      "Generated based on your preferences.",
    ].join("\n");
  }, [digest]);

  const copyDigest = useCallback(() => {
    navigator.clipboard.writeText(digestText);
    toast({ description: "Digest copied to clipboard." });
  }, [digestText]);

  const emailDigest = useCallback(() => {
    const subject = encodeURIComponent("My 9AM Job Digest");
    const body = encodeURIComponent(digestText);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }, [digestText]);

  /* ── No preferences ── */
  if (!prefs) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-6">
          <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <CardTitle className="mb-2">Preferences Required</CardTitle>
          <CardDescription className="mb-4">Set preferences to generate a personalized digest.</CardDescription>
          <Button asChild><Link to="/settings">Go to Settings</Link></Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-2xl mx-auto w-full">
      {/* Generate button */}
      {!digest && (
        <div className="text-center mb-6">
          <Button size="lg" onClick={generate} className="gap-2">
            <Sparkles className="h-4 w-4" /> Generate Today's 9AM Digest (Simulated)
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      )}

      {/* Digest card */}
      {digest && (
        <Card className="bg-card shadow-lg">
          <CardHeader className="text-center border-b pb-4">
            <CardTitle className="text-xl md:text-2xl">Top 10 Jobs For You — 9AM Digest</CardTitle>
            <CardDescription>{formatDate()}</CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3">
            {digest.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No matching roles today. Check again tomorrow.</p>
              </div>
            ) : (
              digest.map((d, i) => (
                <div key={d.id} className="flex items-start justify-between gap-3 border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex gap-3 min-w-0">
                    <span className="text-sm font-medium text-muted-foreground pt-0.5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="font-serif font-semibold text-sm leading-tight truncate">{d.title}</p>
                      <p className="text-xs text-foreground/80">{d.company}</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{d.location}</span>
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{d.experience}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={scoreBadgeVariant(d.matchScore)}>{d.matchScore}%</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={d.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>

          {digest.length > 0 && (
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
          )}
        </Card>
      )}
    </div>
  );
};

export default Digest;
