import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Rule {
  id: string;
  title: string;
  description: string;
}

const RuleReview = () => {
  const location = useLocation();
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resonates, setResonates] = useState<string>("");
  const [applicable, setApplicable] = useState<string>("");
  const [learnedNew, setLearnedNew] = useState<string>("");
  const [thoughts, setThoughts] = useState("");
  const { toast } = useToast();

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
    } else {
      // Load a random rule on initial page load
      loadRandomRule();
    }
  }, [location.state]);

  const loadRandomRule = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("id");

      if (error) throw error;

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentRule(data[randomIndex]);
        setResonates("");
        setApplicable("");
        setLearnedNew("");
        setThoughts("");
      } else {
        toast({
          title: "No rules found",
          description: "Please add some rules first.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading rule:", error);
      toast({
        title: "Error",
        description: "Failed to load rule.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentRule) return;

    if (!resonates || !applicable || !learnedNew) {
      toast({
        title: "Please answer all questions",
        description: "All yes/no questions are required.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("rule_responses").insert({
        rule_title: currentRule.title,
        resonates: resonates === "yes",
        applicable: applicable === "yes",
        learned_new: learnedNew === "yes",
        thoughts: thoughts.trim(),
      });

      if (error) throw error;

      toast({
        title: "Response submitted",
        description: "Thank you for your feedback!",
      });

      loadRandomRule();
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "Failed to submit response.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/90 hover:bg-primary hover:text-primary-foreground hover:border-primary border-border">
              <Home className="mr-2 h-4 w-4" />
              Scenario Helper
            </Button>
          </Link>
          <Link to="/rules">
            <Button variant="outline" className="bg-white/90 hover:bg-primary hover:text-primary-foreground hover:border-primary border-border">
              <BookOpen className="mr-2 h-4 w-4" />
              Rules Browser
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="bg-white/90 hover:bg-primary hover:text-primary-foreground hover:border-primary border-border">
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-bold mb-3" style={{ color: 'hsl(0 0% 85%)' }}>Wanna one better for a bit?</h1>
            <p className="text-xl text-muted-foreground">Leave your mark on a perfec™ #1 rule</p>
          </div>
          <Button 
            onClick={loadRandomRule} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? "Loading..." : "Give Me Another"}
          </Button>
        </div>

        {/* Rule Card */}
        {currentRule ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{currentRule.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {currentRule.description}
              </p>

              <div className="space-y-6 pt-4 border-t">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
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

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
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

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
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

                <div className="space-y-3">
                  <Label htmlFor="thoughts" className="text-base font-semibold">
                    Share your thoughts, an example or an addition to the rule.
                  </Label>
                  <Textarea
                    id="thoughts"
                    placeholder="Your thoughts..."
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Link to="/rules" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Back to List
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Click "Give Me Another" to start reviewing rules
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
        <Link to="/contact" className="hover:text-primary">Contact</Link>
      </footer>
    </div>
  );
};

export default RuleReview;