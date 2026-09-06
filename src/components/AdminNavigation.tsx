import { Link, useLocation } from "react-router-dom";
import { BookOpen, FileText, LayoutDashboard, Lightbulb, Mail, MessageSquare } from "lucide-react";
import PerfecLogotype from "@/components/PerfecLogotype";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/rules/manage", icon: BookOpen, label: "Rules" },
  { to: "/responses", icon: FileText, label: "Responses" },
  { to: "/guidance", icon: Lightbulb, label: "Guidance" },
  { to: "/messages", icon: Mail, label: "Messages" },
  { to: "/suggestions", icon: MessageSquare, label: "Suggestions" },
];

const AdminNavigation = () => {
  const location = useLocation();
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex">
        <Link to="/" className="border-b border-sidebar-border p-6">
          <PerfecLogotype variant="cream" className="h-7" />
          <span className="mt-3 block text-xs font-semibold uppercase text-sidebar-foreground/65" style={{ letterSpacing: "0.08em" }}>Admin workspace</span>
        </Link>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase text-sidebar-foreground/45" style={{ letterSpacing: "0.12em" }}>Operations</p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return <Link key={to} to={to} aria-current={active ? "page" : undefined} className={`flex min-h-11 items-center gap-3 rounded-sm border px-3 text-sm font-medium transition-colors ${active ? "border-sidebar-primary/50 bg-sidebar-accent text-sidebar-foreground" : "border-transparent text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <span className={`h-2 w-2 rounded-full ${active ? "bg-sidebar-primary" : "bg-sidebar-foreground/25"}`} />
              <Icon className="h-4 w-4" />{label}
            </Link>;
          })}
        </nav>
        <Link to="/" className="border-t border-sidebar-border p-5 text-xs font-semibold uppercase text-sidebar-foreground/60 hover:text-primary">← Public site</Link>
      </aside>
      <nav className="flex gap-2 overflow-x-auto border-b bg-card px-4 py-3 lg:hidden">
        {navItems.map(({ to, icon: Icon, label }) => <Link key={to} to={to} className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${location.pathname === to ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}><Icon className="h-4 w-4" />{label}</Link>)}
      </nav>
    </>
  );
};

export default AdminNavigation;