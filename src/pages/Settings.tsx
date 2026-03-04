import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const modes = ["Remote", "Hybrid", "Onsite"];
const levels = ["Junior", "Mid-level", "Senior", "Lead"];

const Settings = () => {
  return (
    <div className="flex-1 p-3 max-w-prose mx-auto">
      <div className="mb-3">
        <h1 className="font-serif text-heading text-foreground">Tracking Preferences</h1>
        <p className="text-small text-muted-foreground mt-0.5">
          Define what roles matter to you. Matching logic will be built in the next step.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="keywords">Role Keywords</Label>
            <Input id="keywords" placeholder="e.g. Frontend Engineer, Product Designer" />
            <p className="text-caption text-muted-foreground">Comma-separated titles or keywords.</p>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="locations">Preferred Locations</Label>
            <Input id="locations" placeholder="e.g. Bangalore, Remote, San Francisco" />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Work Mode</Label>
            <div className="flex gap-1 flex-wrap">
              {modes.map((mode) => (
                <Button key={mode} variant="secondary" size="sm">
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Experience Level</Label>
            <div className="flex gap-1 flex-wrap">
              {levels.map((level) => (
                <Button key={level} variant="secondary" size="sm">
                  {level}
                </Button>
              ))}
            </div>
          </div>

          <Button className="mt-1 self-start" disabled>
            Save Preferences
          </Button>
          <p className="text-caption text-muted-foreground">
            Save is disabled until logic is implemented.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
