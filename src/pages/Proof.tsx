import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AlertTriangle, CheckCircle2, RotateCcw, HelpCircle, Lock, Unlock } from "lucide-react";
import {
  testItems,
  getCheckedItems,
  setCheckedItems,
  resetChecklist,
  allPassed,
  passedCount,
} from "@/lib/test-checklist";

const proofSteps = ["UI Built", "Logic Working", "Test Passed", "Deployed"];

const Proof = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(getCheckedItems);
  const passed = passedCount(checked);
  const total = testItems.length;
  const allDone = allPassed(checked);

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

  return (
    <div className="flex-1 p-3 md:p-6 max-w-2xl mx-auto w-full">
      <div className="mb-4">
        <h1 className="font-serif text-heading text-foreground">Build Proof</h1>
        <p className="text-small text-muted-foreground mt-0.5">
          Collect artifacts that demonstrate each milestone is complete.
        </p>
      </div>

      {/* Proof Steps */}
      <div className="flex flex-col gap-2 mb-6">
        {proofSteps.map((step, i) => {
          const isDeployed = step === "Deployed";
          const locked = isDeployed && !allDone;
          return (
            <Card key={step} className={locked ? "opacity-60" : ""}>
              <CardContent className="flex items-center gap-2 py-2 pt-2">
                <div className="w-[24px] h-[24px] rounded-sm border border-input flex-shrink-0 flex items-center justify-center">
                  {locked ? (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  ) : isDeployed && allDone ? (
                    <Unlock className="h-3.5 w-3.5 text-success" />
                  ) : null}
                </div>
                <div>
                  <p className="text-small text-foreground font-medium">{step}</p>
                  <p className="text-caption text-muted-foreground">
                    {locked
                      ? "Complete all test items below to unlock."
                      : "Proof not yet submitted."}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Test Checklist */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Test Checklist</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-1 text-xs h-7">
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>

          {/* Summary */}
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
