import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, MessageSquare, Mail, BookOpen, Lightbulb, FileEdit } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminNavigation = () => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/rules/manage", icon: BookOpen, label: "Rules" },
    { to: "/responses", icon: FileText, label: "Responses" },
    { to: "/guidance", icon: Lightbulb, label: "Guidance" },
    { to: "/messages", icon: Mail, label: "Messages" },
    { to: "/suggestions", icon: MessageSquare, label: "Suggestions" },
    { to: "/pages", icon: FileEdit, label: "Pages" },
  ];

  return (
    <nav className="border-b bg-card mb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 py-4">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link key={to} to={to}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
