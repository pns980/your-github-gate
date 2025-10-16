import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground space-x-4">
      <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
      <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
      <Link to="/contact" className="hover:text-primary">Contact</Link>
    </footer>
  );
};

export default Footer;
