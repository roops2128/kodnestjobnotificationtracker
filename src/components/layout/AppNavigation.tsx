import { NavLink } from "@/components/NavLink";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Saved", path: "/saved" },
  { title: "Digest", path: "/digest" },
  { title: "Settings", path: "/settings" },
  { title: "Proof", path: "/proof" },
];

const linkClass =
  "font-sans text-small text-muted-foreground px-1 py-0.5 border-b-2 border-transparent transition-system";
const activeClass = "text-foreground border-primary";

const AppNavigation = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <nav className="border-b bg-card">
        <div className="flex items-center justify-between px-3 h-[48px]">
          <span className="font-serif text-subheading text-foreground">KodNest</span>
          <button
            onClick={() => setOpen(!open)}
            className="p-0.5 text-muted-foreground hover:text-foreground transition-system"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="flex flex-col border-t px-3 py-1 gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="font-sans text-small text-muted-foreground py-1 border-l-2 border-transparent pl-1 transition-system"
                activeClassName="text-foreground border-primary"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav className="flex items-center border-b bg-card px-3 h-[48px] gap-3">
      <span className="font-serif text-subheading text-foreground mr-4">KodNest</span>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={linkClass}
          activeClassName={activeClass}
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  );
};

export default AppNavigation;
