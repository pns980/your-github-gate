import { Link } from "react-router-dom";
import PerfecLogotype from "@/components/PerfecLogotype";

const Footer = () => (
  <footer className="mt-12 border-t border-border pt-6">
    <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
      <div className="flex items-center gap-3">
        <PerfecLogotype className="h-5" />
        <span>Number One Rules</span>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        <Link to="/privacy" className="hover:text-primary">Privacy</Link>
        <Link to="/terms" className="hover:text-primary">Terms</Link>
        <Link to="/contact" className="hover:text-primary">Contact</Link>
      </nav>
    </div>
  </footer>
);

export default Footer;