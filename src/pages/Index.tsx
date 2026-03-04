import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import TopBar from "@/components/layout/TopBar";
import ContextHeader from "@/components/layout/ContextHeader";
import SecondaryPanel from "@/components/layout/SecondaryPanel";
import ProofFooter from "@/components/layout/ProofFooter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [proofItems, setProofItems] = useState([
    { id: "ui", label: "UI Built", checked: false },
    { id: "logic", label: "Logic Working", checked: false },
    { id: "test", label: "Test Passed", checked: false },
    { id: "deploy", label: "Deployed", checked: false },
  ]);

  const toggleProof = (id: string) => {
    setProofItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <PageLayout
      topBar={
        <TopBar
          projectName="KodNest Premium Build System"
          currentStep={1}
          totalSteps={6}
          status="in-progress"
        />
      }
      contextHeader={
        <ContextHeader
          headline="Design System Foundation"
          subtext="Establish the visual language, spacing scale, typography, and component tokens that govern every screen."
        />
      }
      primaryWorkspace={
        <div className="flex flex-col gap-3">
          {/* Typography showcase */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>Serif headings. Sans-serif body. Generous spacing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <h1 className="font-serif text-display text-foreground">Display Heading</h1>
              <h2 className="font-serif text-heading text-foreground">Section Heading</h2>
              <h3 className="font-serif text-subheading text-foreground">Subheading</h3>
              <p className="text-body text-foreground max-w-prose">
                Body text set at a comfortable reading size with generous line height. Text blocks are capped at 720px to maintain optimal readability across screen widths.
              </p>
              <p className="text-small text-muted-foreground">
                Small helper text for secondary information.
              </p>
              <p className="text-caption text-muted-foreground">
                Caption text for labels and metadata.
              </p>
            </CardContent>
          </Card>

          {/* Color palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Four colors. No more.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-background border" />
                  <span className="text-caption text-muted-foreground">Background</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-foreground" />
                  <span className="text-caption text-muted-foreground">Ink</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-primary" />
                  <span className="text-caption text-muted-foreground">Accent</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-muted" />
                  <span className="text-caption text-muted-foreground">Muted</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-success" />
                  <span className="text-caption text-muted-foreground">Success</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-[64px] h-[64px] rounded-md bg-warning" />
                  <span className="text-caption text-muted-foreground">Warning</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Primary solid, secondary outlined, consistent radii.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap items-center">
                <Button variant="default">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="default" size="sm">Small</Button>
                <Button variant="default" size="lg">Large</Button>
                <Button variant="default" disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          {/* Inputs */}
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
              <CardDescription>Clean borders, clear focus, no heavy shadows.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2 max-w-prose">
                <Input placeholder="Default input" />
                <Input placeholder="Disabled input" disabled />
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Status indicators with semantic meaning.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-1 flex-wrap">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="muted">Muted</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Empty & Error states */}
          <Card>
            <CardHeader>
              <CardTitle>Empty & Error States</CardTitle>
              <CardDescription>Always guide, never blame.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="border border-dashed rounded-md p-4 text-center">
                <p className="text-body text-muted-foreground">No items yet.</p>
                <p className="text-small text-muted-foreground mt-1">
                  Create your first item to get started.
                </p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Create Item
                </Button>
              </div>

              <div className="border border-destructive/30 rounded-md p-3 bg-destructive/5">
                <p className="text-small text-foreground font-medium">
                  Connection failed
                </p>
                <p className="text-small text-muted-foreground mt-0.5">
                  The API endpoint did not respond. Check your network connection and try again.
                </p>
                <Button variant="secondary" size="sm" className="mt-2">
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      }
      secondaryPanel={
        <SecondaryPanel
          stepTitle="Step 1: Design Tokens"
          stepDescription="Define color variables, typography scale, and spacing in index.css and tailwind.config.ts."
          prompt={`Update index.css with:\n--background: #F7F6F3\n--primary: #8B0000\n--foreground: #111111\n\nSet font-family for headings to Source Serif 4.`}
        />
      }
      proofFooter={
        <ProofFooter items={proofItems} onToggle={toggleProof} />
      }
    />
  );
};

export default Index;
