const ARTIFACTS_KEY = "jobTrackerProofArtifacts";

export interface ProofArtifacts {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

const empty: ProofArtifacts = { lovableLink: "", githubLink: "", deployedLink: "" };

export const loadArtifacts = (): ProofArtifacts => {
  try {
    const raw = localStorage.getItem(ARTIFACTS_KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
};

export const saveArtifacts = (a: ProofArtifacts): void => {
  localStorage.setItem(ARTIFACTS_KEY, JSON.stringify(a));
};

export const isValidUrl = (value: string): boolean => {
  if (!value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const allLinksValid = (a: ProofArtifacts): boolean =>
  isValidUrl(a.lovableLink) && isValidUrl(a.githubLink) && isValidUrl(a.deployedLink);

export type ShipStatus = "Not Started" | "In Progress" | "Shipped";

export const getShipStatus = (allTestsPassed: boolean, artifacts: ProofArtifacts): ShipStatus => {
  const linksReady = allLinksValid(artifacts);
  if (allTestsPassed && linksReady) return "Shipped";
  const hasAnyLink = artifacts.lovableLink || artifacts.githubLink || artifacts.deployedLink;
  if (hasAnyLink || allTestsPassed) return "In Progress";
  return "Not Started";
};

export const buildSubmissionText = (a: ProofArtifacts): string =>
  `Job Notification Tracker — Final Submission

Lovable Project:
${a.lovableLink.trim()}

GitHub Repository:
${a.githubLink.trim()}

Live Deployment:
${a.deployedLink.trim()}

Core Features:
- Intelligent match scoring
- Daily digest simulation
- Status tracking
- Test checklist enforced`;
