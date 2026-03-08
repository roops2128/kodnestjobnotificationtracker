import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  AlertTriangle, CheckCircle2, RotateCcw, HelpCircle,
  Lock, Unlock, Copy, ExternalLink, Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  testItems, getCheckedItems, setCheckedItems,
  resetChecklist, allPassed, passedCount,
} from "@/lib/test-checklist";
import {
  loadArtifacts, saveArtifacts, isValidUrl, allLinksValid,
  getShipStatus, buildSubmissionText, type ProofArtifacts,
} from "@/lib/proof-artifacts";

const steps = [
  "Preferences & Match Scoring",
  "Dashboard & Job Cards",
  "Save & Apply Actions",
  "Status Tracking",
  "Status Filters",
  "Daily Digest",
  "Test Checklist",
  "Proof & Submission",
];

const Proof = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(getCheckedItems);
  const [artifacts, setArtifacts] = useState<ProofArtifacts>(loadArtifacts);
  const [copied, setCopied] = useState(false);

  const passed = passedCount(checked);
  const total = testItems.length;
  const allDone = allPassed(checked);
  const shipStatus = getShipStatus(allDone, artifacts);

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      setCheckedItems(next);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    resetChecklist();
    setChecked({});
  }, []);

  const updateArtifact = useCallback((key: keyof ProofArtifacts, value: string) => {
    setArtifacts(prev => {
      const next = { ...prev, [key]: value };
      saveArtifacts(next);
      return next;
    });
  }, []);

  const handleCopy = useCallback(async () => {
    const text = buildSubmissionText(artifacts);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied to clipboard", description: "Final submission text is ready to paste." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  }, [artifacts]);

  const linkFields: { key: keyof ProofArtifacts; label: string; placeholder: string }[] = [
    { key: "lovableLink", label: "Lovable Project Link", placeholder: "https://lovable.dev/projects/..." },
    { key: "githubLink", label: "GitHub Repository Link", placeholder: "https://github.com/user/repo" },
    { key: "deployedLink", label: "Deployed URL", placeholder: "https://your-app.vercel.app" },
  ];

  return (
    <div className="flex-1 p-3 md:p-6 max-w-2xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-heading text-foreground">Build Proof</h1>
        <p className="text-small text-muted-foreground mt-0.5">
          Project 1 — Job Notification Tracker
        </p>
      </div>

      {/* Ship Status Badge */}
      <div className="flex items-center gap-2">
        <span className="text-small text-muted-foreground">Project Status:</span>
        <Badge
          variant={
            shipStatus === "Shipped" ? "success"
              : shipStatus === "In Progress" ? "warning"
                : "muted"
          }
        >
          {shipStatus}
        </Badge>
      </div>

      {/* Shipped confirmation */}
      {shipStatus === "Shipped" && (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-2 py-3">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <p className="text-sm text-foreground">Project 1 Shipped Successfully.</p>
          </CardContent>
        </Card>
      )}

      {/* A) Step Completion Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Step Completion Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-1">
              <span className="text-sm text-foreground">
                <span className="text-muted-foreground mr-1.5">{i + 1}.</span>
                {step}
              </span>
              <Badge variant="success" className="text-[11px] gap-1">
                <Check className="h-3 w-3" /> Completed
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* B) Artifact Collection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Artifact Collection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {linkFields.map(({ key, label, placeholder }) => {
            const value = artifacts[key];
            const valid = isValidUrl(value);
            const showError = value.trim().length > 0 && !valid;
            return (
              <div key={key} className="space-y-1.5">
                <Label htmlFor={key} className="text-sm font-medium">
                  {label}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={key}
                    value={value}
                    onChange={e => updateArtifact(key, e.target.value)}
                    placeholder={placeholder}
                    className={showError ? "border-destructive" : valid ? "border-success/50" : ""}
                  />
                  {valid && (
                    <Button variant="ghost" size="icon" asChild className="shrink-0">
                      <a href={value.trim()} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                {showError && (
                  <p className="text-xs text-destructive">Enter a valid URL starting with https://</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Copy Final Submission */}
      <Card>
        <CardContent className="py-3">
          <Button
            onClick={handleCopy}
            disabled={!allLinksValid(artifacts)}
            className="w-full gap-2"
            variant={copied ? "outline" : "default"}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Final Submission"}
          </Button>
          {!allLinksValid(artifacts) && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Provide all 3 valid links to enable submission export.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ship Lock Status */}
      <Card className={shipStatus !== "Shipped" ? "opacity-75" : ""}>
        <CardContent className="flex items-center gap-3 py-3">
          {shipStatus === "Shipped" ? (
            <Unlock className="h-4 w-4 text-success shrink-0" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div>
            <p className="text-sm font-medium text-foreground">Ship Gate</p>
            <p className="text-xs text-muted-foreground">
              {shipStatus === "Shipped"
                ? "All conditions met — project is shipped."
                : `Requires: all ${total} test items passed${allDone ? " ✓" : ""} + all 3 artifact links${allLinksValid(artifacts) ? " ✓" : ""}.`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Test Checklist</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs h-7">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {allDone ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> All {total} Passed
              </Badge>
            ) : (
              <>
                <Badge variant="secondary">Tests Passed: {passed} / {total}</Badge>
                <span className="text-xs text-warning flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Resolve all issues before shipping.
                </span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {testItems.map(item => (
            <label
              key={item.id}
              className="flex items-center gap-2 py-1.5 px-1 rounded hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={!!checked[item.id]}
                onCheckedChange={() => toggle(item.id)}
              />
              <span className={`text-sm flex-1 ${checked[item.id] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                {item.label}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[220px] text-xs">
                  {item.howToTest}
                </TooltipContent>
              </Tooltip>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Proof;
