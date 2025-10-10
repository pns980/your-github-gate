import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Number One Rules (the "Website"), you accept and agree to be bound by the terms 
              and provisions of this agreement. If you do not agree to these Terms & Conditions, please do not use 
              the Website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily access the materials (information or software) on Number One Rules' 
              website for personal, non-commercial viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the Website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated 
              by Number One Rules at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="text-muted-foreground mb-4">
              The materials on Number One Rules' website are provided on an 'as is' basis. Number One Rules makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or 
              non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-muted-foreground">
              Further, Number One Rules does not warrant or make any representations concerning the accuracy, likely 
              results, or reliability of the use of the materials on its website or otherwise relating to such materials 
              or on any sites linked to this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Content and Rules</h2>
            <p className="text-muted-foreground mb-4">
              The rules, guidance, and content provided on this Website are for informational and educational purposes only. 
              They should not be considered as professional advice. You should:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Not rely solely on the information provided for making important decisions</li>
              <li>Seek professional advice when appropriate</li>
              <li>Use your own judgment when applying any rules or guidance</li>
              <li>Understand that individual circumstances may vary</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Limitations</h2>
            <p className="text-muted-foreground">
              In no event shall Number One Rules or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to 
              use the materials on Number One Rules' website, even if Number One Rules or a Number One Rules authorized 
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Accuracy of Materials</h2>
            <p className="text-muted-foreground">
              The materials appearing on Number One Rules' website could include technical, typographical, or photographic 
              errors. Number One Rules does not warrant that any of the materials on its website are accurate, complete, 
              or current. Number One Rules may make changes to the materials contained on its website at any time without 
              notice. However, Number One Rules does not make any commitment to update the materials.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Links</h2>
            <p className="text-muted-foreground">
              Number One Rules has not reviewed all of the sites linked to its website and is not responsible for the 
              contents of any such linked site. The inclusion of any link does not imply endorsement by Number One Rules 
              of the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. User Conduct</h2>
            <p className="text-muted-foreground mb-4">
              When using the Website, you agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to any part of the Website</li>
              <li>Interfere with or disrupt the Website or servers</li>
              <li>Submit false or misleading information</li>
              <li>Use the Website for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on the Website, including but not limited to text, graphics, logos, images, and software, 
              is the property of Number One Rules or its content suppliers and is protected by international copyright 
              and intellectual property laws. Unauthorized use of any materials may violate copyright, trademark, and 
              other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Privacy</h2>
            <p className="text-muted-foreground">
              Your use of the Website is also governed by our Privacy Policy. Please review our{" "}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which explains how 
              we collect, use, and protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Modifications</h2>
            <p className="text-muted-foreground">
              Number One Rules may revise these Terms & Conditions for its website at any time without notice. By using 
              this website, you are agreeing to be bound by the then-current version of these Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to terminate or suspend access to our Website immediately, without prior notice or 
              liability, for any reason whatsoever, including without limitation if you breach the Terms & Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms & Conditions are governed by and construed in accordance with the laws of the European Union, 
              and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms & Conditions is found to be invalid or unenforceable, the remaining 
              provisions shall continue to be valid and enforceable to the fullest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <Link to="/contact" className="text-primary hover:underline">Contact Form</Link>
            </p>
          </section>
        </div>

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground space-x-4">
          <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </footer>
      </div>
    </div>
  );
};

export default Terms;
