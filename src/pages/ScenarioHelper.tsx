import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Wand2, Lightbulb, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ScenarioHelper = () => {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [appliedRules, setAppliedRules] = useState("");
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    url: "",
    status: "",
    headers: "",
    response: ""
  });
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!scenario.trim()) {
      toast({
        title: "Input required",
        description: "Please describe your workplace scenario",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResponse("");
    setAppliedRules("");

    try {
      const url = `https://script.google.com/macros/s/AKfycbw6qXXzzJj-5ulyAqOBxL33j8CyUc9CiVxl3sD15ItgbHRhF-z5FLFxsY7Ue8b1Gd2t/exec?scenario=${encodeURIComponent(scenario)}`;
      
      setDebugInfo(prev => ({ ...prev, url }));

      const fetchResponse = await fetch(url);
      
      setDebugInfo(prev => ({
        ...prev,
        status: `${fetchResponse.status} ${fetchResponse.statusText}`,
        headers: JSON.stringify(Object.fromEntries(fetchResponse.headers.entries()), null, 2)
      }));

      // Handle JSONP response - extract JSON from callback wrapper
      const textResponse = await fetchResponse.text();
      const jsonMatch = textResponse.match(/callback\((.*)\)/);
      const jsonString = jsonMatch ? jsonMatch[1] : textResponse;
      const data = JSON.parse(jsonString);
      
      setDebugInfo(prev => ({
        ...prev,
        response: JSON.stringify(data, null, 2)
      }));

      if (data.reply) {
        setResponse(data.reply);
        setAppliedRules(data.rulesUsed || "No guidelines information available");
        
        toast({
          title: "Success!",
          description: "Your guidance has been generated"
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get guidance. Please try again.",
        variant: "destructive"
      });
      
      setResponse("Unable to generate guidance at this time. Please try again later.");
      setDebugInfo(prev => ({
        ...prev,
        response: error instanceof Error ? error.message : "Unknown error"
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-5">
      <div className="max-w-[800px] mx-auto">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-3xl p-10 text-center text-white mb-0">
          <h1 className="text-5xl mb-3 font-semibold">Workplace Scenario AI Helper</h1>
          <p className="text-lg opacity-90">Get intelligent guidance based on proven workplace principles</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-b-3xl p-10 shadow-2xl">
          <Link to="/rules">
            <Button className="mb-6 bg-primary hover:bg-primary/90 text-white">
              <BookOpen className="mr-2 h-4 w-4" />
              Browse All Rules
            </Button>
          </Link>

          <div className="mb-8">
            <label className="block mb-4 font-semibold text-gray-700 text-lg flex items-center gap-2">
              <span className="text-2xl">✏️</span>
              Describe your workplace scenario
            </label>
            <div className="relative">
              <Textarea
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Example: I have a team member who consistently misses deadlines and it's affecting our project deliverables. How should I address this situation professionally?"
                className="min-h-[150px] text-base resize-y border-2 border-gray-200 focus:border-primary rounded-2xl p-4"
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {scenario.length} characters
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {loading ? "Analyzing scenario..." : "Get Guidance"}
            </Button>
            
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Analyzing scenario...</span>
              </div>
            )}
          </div>
          
          {response && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                Guidance
              </h2>
              
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Applied Guidelines
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {appliedRules}
                </div>
              </div>
              
              <Button
                onClick={() => setShowDebug(!showDebug)}
                variant="outline"
                className="mt-6 border-2 border-gray-300 hover:bg-gray-100"
              >
                <Bug className="mr-2 h-4 w-4" />
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </Button>
            </div>
          )}
          
          {showDebug && (
            <div className="mt-6 bg-gray-900 text-gray-100 rounded-2xl p-6 font-mono text-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                <Bug className="h-5 w-5" />
                Debug Information
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-cyan-400 font-semibold">Request URL:</span>
                  <div className="mt-1 break-all text-gray-300">{debugInfo.url}</div>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Response Status:</span>
                  <div className="mt-1 text-gray-300">{debugInfo.status}</div>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Response Headers:</span>
                  <pre className="mt-1 overflow-x-auto text-gray-300">{debugInfo.headers}</pre>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Raw Response:</span>
                  <pre className="mt-1 overflow-x-auto text-gray-300">{debugInfo.response}</pre>
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
