import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, RefreshCw, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ScenarioHelper = () => {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [appliedRules, setAppliedRules] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!scenario.trim()) {
      toast({
        title: "Input required",
        description: "Please describe your scenario",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse("");
    setAppliedRules("");

    try {
      const url = `https://script.google.com/macros/s/AKfycbwSZ0eIG1ZzQbpw0Je_tMZKnt8cIIcGhjgd683sVY-qrGuzUpY2oHYFr6Uqb5lVz4FJgQ/exec?scenario=${encodeURIComponent(scenario)}`;

      const fetchResponse = await fetch(url);
      const textResponse = await fetchResponse.text();

      let data;
      try {
        data = JSON.parse(textResponse);
      } catch {
        const jsonMatch = textResponse.match(/callback\((.*)\)/);
        if (jsonMatch) {
          try {
            data = JSON.parse(jsonMatch[1]);
          } catch {
            throw new Error(textResponse);
          }
        } else {
          throw new Error(textResponse);
        }
      }

      if (data.success === false && data.error === "AI response parsing failed" && data.raw_response) {
        try {
          const rawResponse = data.raw_response.trim();
          const cleanedResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
          const parsedAiResponse = JSON.parse(cleanedResponse);

          data = {
            success: true,
            reply: parsedAiResponse.reply,
            rulesUsed: parsedAiResponse.rules_used
          };
        } catch (clientParseError) {
          throw new Error(`Server error: ${data.error || 'Unknown error'}`);
        }
      }

      if (data.success === false) {
        throw new Error(`Server error: ${data.error || 'Unknown error'}`);
      }

      if (data.reply) {
        setResponse(data.reply);
        
        if (data.rules_used && Array.isArray(data.rules_used) && data.rules_used.length > 0) {
          const formattedRules = data.rules_used
            .map((rule: any) => `• ${rule.title}\n  ${rule.reason}`)
            .join("\n\n");
          setAppliedRules(formattedRules);
        } else {
          setAppliedRules("No guidelines information available");
        }
        
        toast({
          title: "Success!",
          description: "Your guidance has been generated"
        });
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("The API returned an unexpected response format. Please check the Google Apps Script.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
      
      setResponse(message);
      setAppliedRules("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <Link to="/rules">
            <Button variant="outline" className="bg-white/90 hover:bg-white border-border">
              <BookOpen className="mr-2 h-4 w-4" />
              Rules Browser
            </Button>
          </Link>
          <Link to="/review">
            <Button variant="outline" className="bg-white/90 hover:bg-white border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rule Review
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3">Scenario AI Helper</h1>
          <p className="text-xl text-muted-foreground">Get intelligent guidance based on proven principles</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <div className="mb-8">
            <label className="block mb-4 font-semibold text-foreground text-lg">
              Describe your scenario
            </label>
            <Textarea
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="Example: I have a team member who consistently misses deadlines and it's affecting our project deliverables. How should I address this situation professionally?"
              className="min-h-[150px] text-base resize-y"
            />
            <div className="text-right text-sm text-muted-foreground mt-2">
              {scenario.length} characters
            </div>
          </div>
          
          <div className="text-center mb-8">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto"
            >
              {loading ? "Analyzing scenario..." : "Get AI Guidance"}
            </Button>
            
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Analyzing scenario...</span>
              </div>
            )}
          </div>
          
          {response && (
            <div className="bg-muted/50 rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" />
                Guidance
              </h2>
              
              <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Applied Guidelines
                </h3>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {appliedRules}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioHelper;