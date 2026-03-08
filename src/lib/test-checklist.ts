const STORAGE_KEY = "jobTrackerTestChecklist";

export interface TestItem {
  id: string;
  label: string;
  howToTest: string;
}

export const testItems: TestItem[] = [
  { id: "prefs-persist", label: "Preferences persist after refresh", howToTest: "Save preferences on /settings, refresh the page, and confirm they are still there." },
  { id: "match-score", label: "Match score calculates correctly", howToTest: "Set preferences, go to /dashboard, and verify scores reflect keyword/location/skill matches." },
  { id: "show-matches", label: '"Show only matches" toggle works', howToTest: "Toggle the switch on /dashboard and confirm only jobs meeting the threshold appear." },
  { id: "save-persist", label: "Save job persists after refresh", howToTest: "Save a job on /dashboard, refresh, then check /saved to confirm it's still listed." },
  { id: "apply-tab", label: "Apply opens in new tab", howToTest: 'Click "Apply" on any job card and verify the link opens in a new browser tab.' },
  { id: "status-persist", label: "Status update persists after refresh", howToTest: "Change a job's status, refresh the page, and confirm the status badge is unchanged." },
  { id: "status-filter", label: "Status filter works correctly", howToTest: "Set a status, then use the status dropdown filter on /dashboard to isolate that status." },
  { id: "digest-top10", label: "Digest generates top 10 by score", howToTest: "Generate a digest on /digest and verify up to 10 jobs are listed sorted by match score." },
  { id: "digest-persist", label: "Digest persists for the day", howToTest: "Generate a digest, refresh the page, and confirm it reloads automatically." },
  { id: "no-console-errors", label: "No console errors on main pages", howToTest: "Open DevTools → Console, visit each page, and confirm no red errors appear." },
];

export const getCheckedItems = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
};

export const setCheckedItems = (items: Record<string, boolean>): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const resetChecklist = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const allPassed = (checked: Record<string, boolean>): boolean =>
  testItems.every(item => checked[item.id] === true);

export const passedCount = (checked: Record<string, boolean>): number =>
  testItems.filter(item => checked[item.id] === true).length;
