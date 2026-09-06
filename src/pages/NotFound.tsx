import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-dark px-4 text-surface-dark-foreground">
      <div className="text-center">
        <p className="eyebrow">Number One Rules</p>
        <h1 className="display-heading mb-4 text-8xl text-surface-dark-foreground">404</h1>
        <p className="mb-6 text-xl text-surface-dark-foreground/70">This page doesn't follow any known rule.</p>
        <Link to="/" className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Return to Home
        </Link>
      </div>
      
      <footer className="mt-12 border-t border-sidebar-border pt-6 text-center text-sm text-surface-dark-foreground/60 space-x-4">
        <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
        <Link to="/contact" className="hover:text-primary">Contact</Link>
      </footer>
    </div>
  );
};

export default NotFound;
