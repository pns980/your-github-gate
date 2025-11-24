import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useRules } from "@/hooks/useRules";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
interface Rule {
  id: string;
  title: string;
  description: string;
}
const RuleReview = () => {
  const location = useLocation();
  const {
    data: allRules,
    loading: rulesLoading
  } = useRules();
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resonates, setResonates] = useState<string>("");
  const [applicable, setApplicable] = useState<string>("");
  const [learnedNew, setLearnedNew] = useState<string>("");
  const [thoughts, setThoughts] = useState("");
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if a rule was passed via navigation state
    if (location.state?.rule) {
      const passedRule = location.state.rule;
      setCurrentRule({
        id: passedRule.id || '',
        title: passedRule.title,
        description: passedRule.description
      });
      setResonates("");
      setApplicable("");
      setLearnedNew("");
      setThoughts("");
    }
  }, [location.state]);

  // Load a random rule once rules are loaded and there's no current rule
  useEffect(() => {
    if (!rulesLoading && allRules && allRules.length > 0 && !currentRule && !location.state?.rule) {
      loadRandomRule();
    }
  }, [rulesLoading, allRules, currentRule, location.state]);
  const loadRandomRule = () => {
    if (!allRules || allRules.length === 0) {
      toast({
        title: "No rules found",
        description: "Please add some rules first.",
        variant: "destructive"
      });
      return;
    }
    const randomIndex = Math.floor(Math.random() * allRules.length);
    setCurrentRule(allRules[randomIndex]);
    setResonates("");
    setApplicable("");
    setLearnedNew("");
    setThoughts("");
  };
  const handleSubmit = async () => {
    if (!currentRule) return;
    if (!resonates || !applicable || !learnedNew) {
      toast({
        title: "Please answer all questions",
        description: "All yes/no questions are required.",
        variant: "destructive"
      });
      return;
    }
    setSubmitting(true);
    try {
      const {
        error
      } = await supabase.from("rule_responses").insert({
        rule_title: currentRule.title,
        resonates: resonates === "yes",
        applicable: applicable === "yes",
        learned_new: learnedNew === "yes",
        thoughts: thoughts.trim()
      });
      if (error) throw error;
      toast({
        title: "Response submitted",
        description: "Thank you for your feedback!"
      });
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      loadRandomRule();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };
  return <div className="min-h-screen gradient-bg p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="review" />

        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3" style={{
          color: 'hsl(0 0% 85%)'
        }}>Leave your mark on a #1 rule</h1>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Become a part of the perfec™ movement                </p>
            <Button onClick={loadRandomRule} disabled={rulesLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto text-sm sm:text-base">
              {rulesLoading ? "Loading..." : "Give Me Another"}
            </Button>
          </div>
        </div>

        {/* Rule Card */}
        {currentRule ? <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl break-words">{currentRule.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {currentRule.description}
              </p>

              <div className="space-y-4 sm:space-y-6 pt-4 border-t">
                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm sm:text-base font-semibold">
                    Does it resonate?
                  </Label>
                  <RadioGroup value={resonates} onValueChange={setResonates}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="resonates-yes" />
                      <Label htmlFor="resonates-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="resonates-no" />
                      <Label htmlFor="resonates-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm sm:text-base font-semibold">
                    Do you find it applicable?
                  </Label>
                  <RadioGroup value={applicable} onValueChange={setApplicable}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="applicable-yes" />
                      <Label htmlFor="applicable-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="applicable-no" />
                      <Label htmlFor="applicable-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-sm sm:text-base font-semibold">
                    Did you learn anything new?
                  </Label>
                  <RadioGroup value={learnedNew} onValueChange={setLearnedNew}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="learned-yes" />
                      <Label htmlFor="learned-yes" className="cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="learned-no" />
                      <Label htmlFor="learned-no" className="cursor-pointer">
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <Label htmlFor="thoughts" className="text-sm sm:text-base font-semibold">
                    Share your thoughts, an example or an addition to the rule.
                  </Label>
                  <Textarea id="thoughts" placeholder="Your thoughts..." value={thoughts} onChange={e => setThoughts(e.target.value)} rows={4} />
                </div>

                <div className="flex flex-col xs:flex-row gap-3">
                  <Link to="/rules" className="flex-1">
                    <Button variant="outline" className="w-full text-sm sm:text-base" size="lg">
                      Back to List
                    </Button>
                  </Link>
                  <Button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base" size="lg">
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> : <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Click "Give Me Another" to start reviewing rules
              </p>
            </CardContent>
          </Card>}
      </div>

      <Footer />
    </div>;
};
export default RuleReview;