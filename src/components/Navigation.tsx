import { Link } from "react-router-dom";
import { Home, BookOpen, RefreshCw, Info, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  currentPage?: 'home' | 'rules' | 'review' | 'about' | 'submit';
}

const Navigation = ({ currentPage }: NavigationProps) => {
  const navItems = [
    { to: "/", icon: Home, label: "Scenario Helper", page: 'home' },
    { to: "/rules", icon: BookOpen, label: "Rules Browser", page: 'rules' },
    { to: "/review", icon: RefreshCw, label: "Rule Review", page: 'review' },
    { to: "/submit-rule", icon: FilePlus, label: "Submit a Rule", page: 'submit' },
    { to: "/about", icon: Info, label: "About", page: 'about' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {navItems.map(({ to, icon: Icon, label, page }) => {
        const isCurrentPage = page === currentPage;
        
        if (isCurrentPage) {
          return (
            <Button 
              key={to}
              variant="outline" 
              className="bg-primary text-primary-foreground border-primary cursor-default pointer-events-none opacity-100"
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          );
        }
        
        return (
          <Link key={to} to={to}>
            <Button variant="outline" className="bg-white/90 hover:bg-primary hover:text-primary-foreground hover:border-primary border-border">
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};

export default Navigation;
