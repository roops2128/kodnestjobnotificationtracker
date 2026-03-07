import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type JobStatus, allStatuses, statusBadgeVariant } from "@/lib/job-status";
import { ChevronDown } from "lucide-react";

interface JobStatusButtonProps {
  status: JobStatus;
  onChangeStatus: (status: JobStatus) => void;
}

const JobStatusButton = ({ status, onChangeStatus }: JobStatusButtonProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" className="gap-1 h-7 text-xs px-1.5">
        <Badge variant={statusBadgeVariant(status)} className="text-[10px] px-1 py-0">
          {status}
        </Badge>
        <ChevronDown className="h-3 w-3" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {allStatuses.map(s => (
        <DropdownMenuItem key={s} onClick={() => onChangeStatus(s)} className="gap-2 text-xs">
          <Badge variant={statusBadgeVariant(s)} className="text-[10px] px-1 py-0">{s}</Badge>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default JobStatusButton;
