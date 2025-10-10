import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      // Load Google Analytics if previously accepted
      loadGoogleAnalytics();
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Load GA script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-MQNNGKJ29Q";
    document.head.appendChild(script1);

    // Initialize GA
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MQNNGKJ29Q', {
        'anonymize_ip': true,
        'cookie_flags': 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    loadGoogleAnalytics();
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-4xl bg-card/95 backdrop-blur-sm border-2 shadow-lg">
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We use cookies and similar technologies to analyze our traffic and improve your experience. 
                This includes Google Analytics to understand how visitors interact with our website. 
                You can choose to accept or reject these analytics cookies. 
                Essential cookies required for the website to function are always active.{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAccept} size="sm">
                  Accept Analytics Cookies
                </Button>
                <Button onClick={handleReject} variant="outline" size="sm">
                  Reject Analytics Cookies
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleReject}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
