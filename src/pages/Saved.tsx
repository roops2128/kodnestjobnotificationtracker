import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs, type Job } from "@/data/jobs";
import { BookmarkCheck, ExternalLink, Eye, MapPin, Briefcase, Clock, BookmarkX } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const SAVED_KEY = "jnt_saved_jobs";
const getSaved = (): number[] => {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); } catch { return []; }
};

const sourceBadgeVariant = (s: Job["source"]) => {
  switch (s) {
    case "LinkedIn": return "default" as const;
    case "Naukri": return "warning" as const;
    case "Indeed": return "secondary" as const;
  }
};

const postedLabel = (d: number) => d === 0 ? "Today" : d === 1 ? "1 day ago" : `${d} days ago`;

const Saved = () => {
  const [savedIds, setSavedIds] = useState<number[]>(getSaved);
  const [viewJob, setViewJob] = useState<Job | null>(null);

  const savedJobs = useMemo(() => jobs.filter(j => savedIds.includes(j.id)), [savedIds]);

  const handleRemove = (id: number) => {
    const next = savedIds.filter(i => i !== id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSavedIds(next);
    toast({ description: "Job removed from saved" });
  };

  if (savedJobs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-5">
        <div className="text-center border border-dashed rounded-md p-8 max-w-prose">
          <BookmarkCheck className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
          <h1 className="font-serif text-2xl text-foreground">No Saved Jobs</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Jobs you bookmark from the dashboard will appear here for easy access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
      <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-1">Saved Jobs</h1>
      <p className="text-muted-foreground text-sm mb-5">{savedJobs.length} saved</p>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {savedJobs.map(job => (
          <Card key={job.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardContent className="pt-3 pb-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Badge variant={sourceBadgeVariant(job.source)}>{job.source}</Badge>
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
              <div className="flex gap-1.5 pt-1">
                <Button variant="secondary" size="sm" onClick={() => setViewJob(job)}>
                  <Eye className="h-3.5 w-3.5 mr-1" /> View
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleRemove(job.id)}>
                  <BookmarkX className="h-3.5 w-3.5 mr-1" /> Remove
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Apply
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!viewJob} onOpenChange={open => !open && setViewJob(null)}>
        <DialogContent className="max-w-lg">
          {viewJob && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif">{viewJob.title}</DialogTitle>
                <DialogDescription>{viewJob.company} · {viewJob.location} · {viewJob.mode}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
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
                <Button size="sm" asChild>
                  <a href={viewJob.applyUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> Apply Now
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Saved;
