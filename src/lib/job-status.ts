export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

const STATUS_PREFIX = "jobTrackerStatus";
const UPDATES_KEY = "jobTrackerStatusUpdates";

export interface StatusUpdate {
  jobId: number;
  title: string;
  company: string;
  status: JobStatus;
  date: string; // ISO string
}

export const getJobStatus = (jobId: number): JobStatus => {
  try {
    const val = localStorage.getItem(`${STATUS_PREFIX}[${jobId}]`);
    if (val && ["Not Applied", "Applied", "Rejected", "Selected"].includes(val)) {
      return val as JobStatus;
    }
  } catch {}
  return "Not Applied";
};

export const setJobStatus = (jobId: number, status: JobStatus): void => {
  localStorage.setItem(`${STATUS_PREFIX}[${jobId}]`, status);
};

export const getAllStatuses = (): Record<number, JobStatus> => {
  const result: Record<number, JobStatus> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STATUS_PREFIX + "[")) {
      const match = key.match(/\[(\d+)\]/);
      if (match) {
        result[parseInt(match[1], 10)] = localStorage.getItem(key) as JobStatus;
      }
    }
  }
  return result;
};

export const getStatusUpdates = (): StatusUpdate[] => {
  try {
    return JSON.parse(localStorage.getItem(UPDATES_KEY) || "[]") as StatusUpdate[];
  } catch {
    return [];
  }
};

export const addStatusUpdate = (update: StatusUpdate): void => {
  const updates = getStatusUpdates();
  updates.unshift(update);
  // Keep last 50
  localStorage.setItem(UPDATES_KEY, JSON.stringify(updates.slice(0, 50)));
};

export const statusBadgeVariant = (status: JobStatus) => {
  switch (status) {
    case "Not Applied": return "muted" as const;
    case "Applied": return "info" as const;
    case "Rejected": return "destructive" as const;
    case "Selected": return "success" as const;
  }
};

export const allStatuses: JobStatus[] = ["Not Applied", "Applied", "Rejected", "Selected"];
