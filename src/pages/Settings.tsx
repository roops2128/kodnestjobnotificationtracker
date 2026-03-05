import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { uniqueLocations, uniqueExperiences } from "@/data/jobs";
import { loadPreferences, savePreferences, defaultPreferences, type Preferences } from "@/lib/preferences";
import { toast } from "@/hooks/use-toast";

const modes = ["Remote", "Hybrid", "Onsite"];

const Settings = () => {
  const [prefs, setPrefs] = useState<Preferences>(defaultPreferences);

  useEffect(() => {
    const saved = loadPreferences();
    if (saved) setPrefs(saved);
  }, []);

  const update = <K extends keyof Preferences>(key: K, val: Preferences[K]) =>
    setPrefs(prev => ({ ...prev, [key]: val }));

  const toggleMode = (mode: string) => {
    const next = prefs.preferredMode.includes(mode)
      ? prefs.preferredMode.filter(m => m !== mode)
      : [...prefs.preferredMode, mode];
    update("preferredMode", next);
  };

  const toggleLocation = (loc: string) => {
    const next = prefs.preferredLocations.includes(loc)
      ? prefs.preferredLocations.filter(l => l !== loc)
      : [...prefs.preferredLocations, loc];
    update("preferredLocations", next);
  };

  const handleSave = () => {
    savePreferences(prefs);
    toast({ description: "Preferences saved. Dashboard will reflect your match scores." });
  };

  return (
    <div className="flex-1 p-3 max-w-prose mx-auto">
      <div className="mb-3">
        <h1 className="font-serif text-2xl text-foreground">Tracking Preferences</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Define what roles matter to you. Jobs will be scored against these preferences.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-4">
          {/* Role Keywords */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="keywords">Role Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g. Frontend, Backend, Data Analyst"
              value={prefs.roleKeywords}
              onChange={e => update("roleKeywords", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated titles or keywords.</p>
          </div>

          {/* Preferred Locations */}
          <div className="flex flex-col gap-1.5">
            <Label>Preferred Locations</Label>
            <div className="flex gap-1.5 flex-wrap">
              {uniqueLocations.map(loc => (
                <Button
                  key={loc}
                  variant={prefs.preferredLocations.includes(loc) ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleLocation(loc)}
                >
                  {loc}
                </Button>
              ))}
            </div>
          </div>

          {/* Work Mode */}
          <div className="flex flex-col gap-1.5">
            <Label>Work Mode</Label>
            <div className="flex gap-3">
              {modes.map(mode => (
                <label key={mode} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <Checkbox
                    checked={prefs.preferredMode.includes(mode)}
                    onCheckedChange={() => toggleMode(mode)}
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-1">
            <Label>Experience Level</Label>
            <Select value={prefs.experienceLevel} onValueChange={v => update("experienceLevel", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                {uniqueExperiences.map(e => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="e.g. React, Python, SQL"
              value={prefs.skills}
              onChange={e => update("skills", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Comma-separated skill names.</p>
          </div>

          {/* Min Match Score */}
          <div className="flex flex-col gap-2">
            <Label>Minimum Match Score: {prefs.minMatchScore}%</Label>
            <Slider
              value={[prefs.minMatchScore]}
              onValueChange={([v]) => update("minMatchScore", v)}
              min={0}
              max={100}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Jobs below this score can be hidden on the dashboard.
            </p>
          </div>

          <Button className="mt-1 self-start" onClick={handleSave}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
