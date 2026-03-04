import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { jobs, uniqueLocations, uniqueModes, uniqueExperiences, uniqueSources, type Job } from "@/data/jobs";
import { Bookmark, BookmarkCheck, ExternalLink, Eye, Search, MapPin, Briefcase, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ── localStorage helpers ── */
const SAVED_KEY = "jnt_saved_jobs";
const getSaved = (): number[] => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); }
  catch { return []; }
};
const toggleSave = (id: number) => {
  const saved = getSaved();
  const next = saved.includes(id) ? saved.filter(i => i !== id) : [...saved, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
};

/* ── Source badge color ── */
const sourceBadgeVariant = (s: Job["source"]) => {
  switch (s) {
    case "LinkedIn": return "default" as const;
    case "Naukri": return "warning" as const;
    case "Indeed": return "secondary" as const;
  }
};

const postedLabel = (d: number) => d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;

const Dashboard = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("all");
  const [mode, setMode] = useState("all");
  const [experience, setExperience] = useState("all");
  const [source, setSource] = useState("all");
  const [sort, setSort] = useState("latest");
  const [savedIds, setSavedIds] = useState<number[]>(getSaved);
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (keyword) {
      const kw = keyword.toLowerCase();
      list = list.filter(j => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw));
    }
    if (location !== "all") list = list.filter(j => j.location === location);
    if (mode !== "all") list = list.filter(j => j.mode === mode);
    if (experience !== "all") list = list.filter(j => j.experience === experience);
    if (source !== "all") list = list.filter(j => j.source === source);
    if (sort === "latest") list.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    else list.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    return list;
  }, [keyword, location, mode, experience, source, sort]);

  const handleSave = (id: number) => {
    const next = toggleSave(id);
    setSavedIds(next);
    toast({
      description: next.includes(id) ? "Job saved" : "Job removed from saved",
    });
  };

  return (
    <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
      <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-1">Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-5">
        {filtered.length} job{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* ── Filter Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-6">
        <div className="col-span-2 md:col-span-4 lg:col-span-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or company…"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className="pl-8"
          />
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
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Job Cards ── */}
      {filtered.length === 0 ? (
        <div className="text-center border border-dashed rounded-md p-8">
          <p className="text-muted-foreground">No jobs match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(job => {
            const isSaved = savedIds.includes(job.id);
            return (
              <Card key={job.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                <CardContent className="pt-3 pb-2 flex flex-col gap-2">
                  {/* Top row: source + posted */}
                  <div className="flex items-center justify-between">
                    <Badge variant={sourceBadgeVariant(job.source)}>{job.source}</Badge>
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {postedLabel(job.postedDaysAgo)}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-semibold leading-tight">{job.title}</h3>
                  <p className="text-sm text-foreground/80">{job.company}</p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location} · {job.mode}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.experience}</span>
                  </div>

                  <p className="text-sm font-medium text-foreground">{job.salaryRange}</p>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-1">
                    <Button variant="secondary" size="sm" onClick={() => setViewJob(job)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant={isSaved ? "default" : "secondary"}
                      size="sm"
                      onClick={() => handleSave(job.id)}
                    >
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

      {/* ── View Modal ── */}
      <Dialog open={!!viewJob} onOpenChange={open => !open && setViewJob(null)}>
        <DialogContent className="max-w-lg">
          {viewJob && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">{viewJob.title}</DialogTitle>
                <DialogDescription>{viewJob.company} · {viewJob.location} · {viewJob.mode}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Experience:</span> {viewJob.experience}
                </div>
                <div>
                  <span className="font-medium">Salary:</span> {viewJob.salaryRange}
                </div>
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
