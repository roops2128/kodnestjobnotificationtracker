import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-5">
      <div className="text-center border border-dashed rounded-md p-4 max-w-prose">
        <h1 className="font-serif text-heading text-foreground">Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          No jobs yet. In the next step, you will load a realistic dataset.
        </p>
        <Link to="/settings">
          <Button variant="secondary" size="sm" className="mt-2">
            Set Preferences First
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
