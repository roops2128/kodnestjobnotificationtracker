import { Checkbox } from "@/components/ui/checkbox";

interface ProofItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ProofFooterProps {
  items: ProofItem[];
  onToggle: (id: string) => void;
}

const ProofFooter = ({ items, onToggle }: ProofFooterProps) => {
  return (
    <footer className="border-t px-3 py-2 bg-card">
      <div className="flex items-center gap-4 flex-wrap">
        {items.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-1 text-small text-foreground cursor-pointer select-none"
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => onToggle(item.id)}
            />
            {item.label}
          </label>
        ))}
      </div>
    </footer>
  );
};

export default ProofFooter;
