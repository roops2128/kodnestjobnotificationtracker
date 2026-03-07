import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { jobs, uniqueLocations, uniqueModes, uniqueExperiences, uniqueSources, type Job } from "@/data/jobs";
import { loadPreferences, computeMatchScore, scoreBadgeVariant, type Preferences } from "@/lib/preferences";
import { Bookmark, BookmarkCheck, ExternalLink, Eye, Search, MapPin, Briefcase, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { type JobStatus, allStatuses, getJobStatus, setJobStatus, addStatusUpdate, statusBadgeVariant } from "@/lib/job-status";
import JobStatusButton from "@/components/JobStatusButton";

/* ── localStorage helpers ── */
const SAVED_KEY = "jnt_saved_jobs";
const getSaved = (): number[] => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
};
const toggleSave = (id: number) => {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(i => i !== id) : [...saved, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
};

const sourceBadgeVariant = (s: Job["source"]) => {
  switch (s) {
    case "LinkedIn": return "default" as const;
    case "Naukri": return "warning" as const;
    case "Indeed": return "secondary" as const;
  }
};

const postedLabel = (d: number) => d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;

const extractSalaryNum = (s: string): number => {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

const Dashboard = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("all");
  const [mode, setMode] = useState("all");
  const [experience, setExperience] = useState("all");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("latest");
  const [statusFilter, setStatusFilter] = useState("all");
  const [savedIds, setSavedIds] = useState<number[]>(getSaved);
  const [viewJob, setViewJob] = useState<Job | null>(null);
  const [matchOnly, setMatchOnly] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<number, JobStatus>>(() => {
    const m: Record<number, JobStatus> = {};
    jobs.forEach(j => { m[j.id] = getJobStatus(j.id); });
    return m;
  });

  const prefs = useMemo<Preferences | null>(() => loadPreferences(), []);

  const scoredJobs = useMemo(() => {
    return jobs.map(job => ({
      job,
      matchScore: prefs ? computeMatchScore(job, prefs) : 0,
    }));
  }, [prefs]);

  const filtered = useMemo(() => {
    let list = [...scoredJobs];

    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(({ job: j }) => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw));
    }
    if (location !== "all") list = list.filter(({ job: j }) => j.location === location);
    if (mode !== "all") list = list.filter(({ job: j }) => j.mode === mode);
    if (experience !== "all") list = list.filter(({ job: j }) => j.experience === experience);
    if (source !== "all") list = list.filter(({ job: j }) => j.source === source);
    if (statusFilter !== "all") list = list.filter(({ job: j }) => (statusMap[j.id] || "Not Applied") === statusFilter);

    if (matchOnly && prefs) {
      list = list.filter(({ matchScore }) => matchScore >= prefs.minMatchScore);
    }

    if (sort === "latest") list.sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo);
    else if (sort === "oldest") list.sort((a, b) => b.job.postedDaysAgo - a.job.postedDaysAgo);
    else if (sort === "match") list.sort((a, b) => b.matchScore - a.matchScore);
    else if (sort === "salary") list.sort((a, b) => extractSalaryNum(b.job.salaryRange) - extractSalaryNum(a.job.salaryRange));

    return list;
  }, [keyword, location, mode, experience, source, sort, scoredJobs, matchOnly, prefs, statusFilter, statusMap]);

  const handleSave = useCallback((id: number) => {
    const next = toggleSave(id);
    setSavedIds(next);
    toast({ description: next.includes(id) ? "Job saved" : "Job removed from saved" });
  }, []);

  const handleStatusChange = useCallback((job: Job, status: JobStatus) => {
    setJobStatus(job.id, status);
    setStatusMap(prev => ({ ...prev, [job.id]: status }));
    if (status !== "Not Applied") {
      addStatusUpdate({ jobId: job.id, title: job.title, company: job.company, status, date: new Date().toISOString() });
    }
    toast({ description: `Status updated: ${status}` });
  }, []);

  const getScoreForModal = (job: Job) =>
    prefs ? computeMatchScore(job, prefs) : 0;

  return (
    <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
      <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-1">Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-4">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      {!prefs && (
        <div className="flex items-center gap-2 border border-dashed rounded-md p-3 mb-4 bg-muted/40">
          <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Set your preferences to activate intelligent matching.{" "}
            <Link to="/settings" className="underline text-primary font-medium">Go to Settings</Link>
          </p>
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
        <div className="col-span-2 md:col-span-4 lg:col-span-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search title or company…" value={keyword} onChange={e => setKeyword(e.target.value)} className="pl-8" />
        </div>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger><SelectValue placeholder="Location" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueLocations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={mode} onValueChange={setMode}>
          <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {uniqueModes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger><SelectValue placeholder="Experience" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            {uniqueExperiences.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {allStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="match">Match Score</SelectItem>
            <SelectItem value="salary">Salary (High)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {prefs && (
        <div className="flex items-center gap-2 mb-5">
          <Switch checked={matchOnly} onCheckedChange={setMatchOnly} id="match-toggle" />
          <Label htmlFor="match-toggle" className="text-sm cursor-pointer">
            Show only jobs above my threshold ({prefs.minMatchScore}%)
          </Label>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center border border-dashed rounded-md p-8">
          <p className="text-muted-foreground">No roles match your criteria. Adjust filters or lower threshold.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ job, matchScore }) => {
            const isSaved = savedIds.includes(job.id);
            const jobStatus = statusMap[job.id] || "Not Applied";
            return (
              <Card key={job.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardContent className="pt-3 pb-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={sourceBadgeVariant(job.source)}>{job.source}</Badge>
                      {prefs && (
                        <Badge variant={scoreBadgeVariant(matchScore)}>{matchScore}% match</Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />{postedLabel(job.postedDaysAgo)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-semibold leading-tight">{job.title}</h3>
                  <p className="text-sm text-foreground/80">{job.company}</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location} · {job.mode}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experience}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{job.salaryRange}</p>
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    <JobStatusButton status={jobStatus} onChangeStatus={(s) => handleStatusChange(job, s)} />
                    <Button variant="secondary" size="sm" onClick={() => setViewJob(job)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button variant={isSaved ? "default" : "secondary"} size="sm" onClick={() => handleSave(job.id)}>
                      {isSaved ? <BookmarkCheck className="h-3.5 w-3.5 mr-1" /> : <Bookmark className="h-3.5 w-3.5 mr-1" />}
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" /> Apply
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!viewJob} onOpenChange={open => !open && setViewJob(null)}>
        <DialogContent className="max-w-lg">
          {viewJob && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">{viewJob.title}</DialogTitle>
                <DialogDescription>{viewJob.company} · {viewJob.location} · {viewJob.mode}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                {prefs && (
                  <div>
                    <Badge variant={scoreBadgeVariant(getScoreForModal(viewJob))}>
                      {getScoreForModal(viewJob)}% match
                    </Badge>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <JobStatusButton
                    status={statusMap[viewJob.id] || "Not Applied"}
                    onChangeStatus={(s) => handleStatusChange(viewJob, s)}
                  />
                </div>
                <div><span className="font-medium">Experience:</span> {viewJob.experience}</div>
                <div><span className="font-medium">Salary:</span> {viewJob.salaryRange}</div>
                <div>
                  <span className="font-medium">Skills:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewJob.skills.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-muted-foreground whitespace-pre-line">{viewJob.description}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" asChild>
                    <a href={viewJob.applyUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> Apply Now
                    </a>
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => handleSave(viewJob.id)}>
                    {savedIds.includes(viewJob.id) ? "Unsave" : "Save"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
