import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Rule {
  id: string;
  title: string;
  description: string;
}

const RuleReview = () => {
  const [currentRule, setCurrentRule] = useState<Rule | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resonates, setResonates] = useState<string>("");
  const [applicable, setApplicable] = useState<string>("");
  const [learnedNew, setLearnedNew] = useState<string>("");
  const [thoughts, setThoughts] = useState("");
  const { toast } = useToast();

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
        // Reset form
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

      // Load next rule automatically
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
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Rule Review</h1>
          <Button onClick={loadRandomRule} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Give me another"
            )}
          </Button>
        </div>

        {currentRule ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{currentRule.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground whitespace-pre-wrap">
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

                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Click "Give me another" to start reviewing rules
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RuleReview;
