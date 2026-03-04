import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="text-center max-w-prose">
        <h1 className="font-serif text-display text-foreground">
          Stop Missing The Right Jobs.
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          Precision-matched job discovery delivered daily at 9AM.
        </p>
        <Link to="/settings">
          <Button className="mt-4" size="lg">
            Start Tracking
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
