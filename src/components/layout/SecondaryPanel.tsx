import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, ExternalLink, CheckCircle, AlertCircle, Camera } from "lucide-react";

interface SecondaryPanelProps {
  stepTitle: string;
  stepDescription: string;
  prompt: string;
  onCopy?: () => void;
  onBuild?: () => void;
  onWorked?: () => void;
  onError?: () => void;
  onScreenshot?: () => void;
}

const SecondaryPanel = ({
  stepTitle,
  stepDescription,
  prompt,
  onCopy,
  onBuild,
  onWorked,
  onError,
  onScreenshot,
}: SecondaryPanelProps) => {
  return (
    <aside className="flex flex-col gap-2">
      {/* Step explanation */}
      <div>
        <h3 className="font-serif text-subheading text-foreground">{stepTitle}</h3>
        <p className="mt-1 text-small text-muted-foreground">{stepDescription}</p>
      </div>

      {/* Prompt box */}
      <Card className="bg-muted p-2">
        <pre className="text-small text-foreground whitespace-pre-wrap font-sans leading-relaxed select-all">
          {prompt}
        </pre>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-1">
        <Button variant="secondary" size="sm" onClick={onCopy}>
          <Copy /> Copy
        </Button>
        <Button variant="default" size="sm" onClick={onBuild}>
          <ExternalLink /> Build in Lovable
        </Button>
      </div>

      <div className="flex flex-wrap gap-1">
        <Button variant="success" size="sm" onClick={onWorked}>
          <CheckCircle /> It Worked
        </Button>
        <Button variant="destructive" size="sm" onClick={onError}>
          <AlertCircle /> Error
        </Button>
        <Button variant="secondary" size="sm" onClick={onScreenshot}>
          <Camera /> Add Screenshot
        </Button>
      </div>
    </aside>
  );
};

export default SecondaryPanel;
