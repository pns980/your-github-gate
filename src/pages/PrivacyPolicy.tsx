import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Number One Rules ("we," "our," or "us"). We are committed to protecting your personal data 
              and respecting your privacy. This Privacy Policy explains how we collect, use, and protect your information 
              when you use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-2">2.1 Information You Provide</h3>
            <p className="text-muted-foreground mb-4">
              We collect information that you voluntarily provide to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Name and email address (via contact form)</li>
              <li>Message content submitted through our contact form</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-medium mb-2 mt-4">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Usage data through Google Analytics (only with your consent)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address (anonymized)</li>
              <li>Pages visited and time spent on pages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To improve our website and user experience</li>
              <li>To analyze website traffic and usage patterns (with consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-muted-foreground mb-4">
              Under the General Data Protection Regulation (GDPR), we process your data based on:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for analytics purposes</li>
              <li><strong>Legitimate interests:</strong> Processing is necessary for our legitimate interests in providing and improving our services</li>
              <li><strong>Legal obligation:</strong> Processing is necessary to comply with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to improve your browsing experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics cookies:</strong> Google Analytics cookies (only with your consent) to understand how visitors use our site</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control and manage cookies through our consent banner or your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Sharing and Third Parties</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal data. We may share your information with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Google Analytics:</strong> For website analytics (only with your consent, with IP anonymization enabled)</li>
              <li><strong>Service providers:</strong> Who help us operate our website and provide services</li>
              <li><strong>Legal authorities:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights (GDPR)</h2>
            <p className="text-muted-foreground mb-4">
              Under GDPR, you have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>Right of access:</strong> You can request copies of your personal data</li>
              <li><strong>Right to rectification:</strong> You can request correction of inaccurate data</li>
              <li><strong>Right to erasure:</strong> You can request deletion of your personal data</li>
              <li><strong>Right to restrict processing:</strong> You can request limitation of how we process your data</li>
              <li><strong>Right to data portability:</strong> You can request transfer of your data</li>
              <li><strong>Right to object:</strong> You can object to our processing of your data</li>
              <li><strong>Right to withdraw consent:</strong> You can withdraw consent at any time</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us using the information in the Contact section below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
              or as required by law. Contact form submissions are retained for customer service purposes and may be deleted 
              upon request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 
              completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your data may be transferred to and processed in countries outside of the European Economic Area (EEA). 
              We ensure appropriate safeguards are in place to protect your data in accordance with GDPR requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our website is not intended for children under 16 years of age. We do not knowingly collect personal 
              data from children. If you believe we have collected data from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
            </p>
            <p className="text-muted-foreground">
              <Link to="/contact" className="text-primary hover:underline">Contact Form</Link>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Supervisory Authority</h2>
            <p className="text-muted-foreground">
              If you believe we have not addressed your concerns adequately, you have the right to lodge a complaint 
              with your local data protection supervisory authority.
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

export default PrivacyPolicy;
