import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FilePlus, Home, Info, Menu, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import PerfecLogotype from "@/components/PerfecLogotype";

interface NavigationProps {
  currentPage?: "home" | "rules" | "review" | "about" | "submit";
}

const navItems = [
  { to: "/", icon: Home, label: "Scenario Helper", page: "home" },
  { to: "/rules", icon: BookOpen, label: "Rules Browser", page: "rules" },
  { to: "/review", icon: RefreshCw, label: "Rule Review", page: "review" },
  { to: "/about", icon: Info, label: "About", page: "about" },
] as const;

const Navigation = ({ currentPage }: NavigationProps) => {
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase text-sidebar-foreground/45" style={{ letterSpacing: "0.12em" }}>
        Main workspace
      </p>
      {navItems.map(({ to, icon: Icon, label, page }) => {
        const active = currentPage === page;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`group flex min-h-11 items-center gap-3 rounded-sm border px-3 text-sm font-medium transition-colors ${
              active
                ? "border-sidebar-primary/50 bg-sidebar-accent text-sidebar-foreground"
                : "border-transparent text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${active ? "bg-sidebar-primary" : "bg-sidebar-foreground/25 group-hover:bg-sidebar-primary"}`} />
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      <header data-workspace-nav className="sticky top-0 z-40 -mx-4 -mt-4 mb-6 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:-mx-6 sm:-mt-6 sm:px-6 lg:hidden">
        <Link to="/" aria-label="Number One Rules home" className="flex items-center gap-3">
          <PerfecLogotype className="h-6" />
          <span className="border-l border-border pl-3 text-xs font-semibold uppercase">Number One Rules</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </Button>
      </header>

      <aside data-workspace-nav className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="border-b border-sidebar-border p-6" aria-label="Number One Rules home">
          <PerfecLogotype variant="cream" className="h-7" />
          <span className="mt-3 block text-xs font-semibold uppercase text-sidebar-foreground/65" style={{ letterSpacing: "0.08em" }}>Number One Rules</span>
        </Link>
        <nav className="flex-1 space-y-1 p-4">{links}</nav>
        <div className="border-t border-sidebar-border p-4">
          <Button asChild className="w-full">
            <Link to="/submit-rule"><FilePlus /> Submit a Rule</Link>
          </Button>
        </div>
      </aside>

      {open && (
        <nav className="fixed inset-x-0 top-16 z-50 space-y-1 border-b bg-sidebar p-4 text-sidebar-foreground shadow-lift lg:hidden">
          {links}
          <Button asChild className="mt-3 w-full">
            <Link to="/submit-rule" onClick={() => setOpen(false)}><FilePlus /> Submit a Rule</Link>
          </Button>
        </nav>
      )}
    </>
  );
};

export default Navigation;