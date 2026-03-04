import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const proofSteps = [
  "UI Built",
  "Logic Working",
  "Test Passed",
  "Deployed",
];

const Proof = () => {
  return (
    <div className="flex-1 p-3 max-w-prose mx-auto">
      <div className="mb-3">
        <h1 className="font-serif text-heading text-foreground">Build Proof</h1>
        <p className="text-small text-muted-foreground mt-0.5">
          Collect artifacts that demonstrate each milestone is complete.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {proofSteps.map((step) => (
          <Card key={step}>
            <CardContent className="flex items-center gap-2 py-2 pt-2">
              <div className="w-[24px] h-[24px] rounded-sm border border-input flex-shrink-0" />
              <div>
                <p className="text-small text-foreground font-medium">{step}</p>
                <p className="text-caption text-muted-foreground">Proof not yet submitted.</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Proof;
