import { Badge } from "@/components/ui/badge";

interface TopBarProps {
  projectName: string;
  currentStep: number;
  totalSteps: number;
  status: "not-started" | "in-progress" | "shipped";
}

const statusConfig = {
  "not-started": { label: "Not Started", variant: "muted" as const },
  "in-progress": { label: "In Progress", variant: "warning" as const },
  "shipped": { label: "Shipped", variant: "success" as const },
};

const TopBar = ({ projectName, currentStep, totalSteps, status }: TopBarProps) => {
  const { label, variant } = statusConfig[status];

  return (
    <header className="flex items-center justify-between border-b px-3 h-[48px] bg-card">
      <span className="font-sans font-medium text-small text-foreground">
        {projectName}
      </span>

      <span className="font-sans text-caption text-muted-foreground">
        Step {currentStep} / {totalSteps}
      </span>

      <Badge variant={variant}>{label}</Badge>
    </header>
  );
};

export default TopBar;
