import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lightbulb, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ScenarioHelper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [appliedRules, setAppliedRules] = useState<any[]>([]);
  const [placeholderExample, setPlaceholderExample] = useState("I have a team member who consistently misses deadlines and it's affecting our project deliverables. How should I address this situation professionally?");
  const [currentGuidanceId, setCurrentGuidanceId] = useState<string | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [currentPerfecBullet, setCurrentPerfecBullet] = useState(0);
  const { toast } = useToast();

  const perfecBullets = [
    "the celebration of being one better than yesterday",
    "the joy of mistakes as growth opportunities",
    "the understanding that bad and better coexist",
    "the feeling at home when things go \"boom\"",
    "the belief that if you cannot change something then it's perfect",
    "the acceptance of the human condition as our once in a lifetime opportunity to propel an infinite progression",
    "the gratification of pragmatism replacing the insecurity behind perfectionism",
    "the euphemism for our inescapable \"bounded rationality\"",
    "the perception of a scratch on your phone screen as uniquely yours",
    "not a typo"
  ];

  // Cycle through perfec bullets
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPerfecBullet((prev) => (prev + 1) % perfecBullets.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, [perfecBullets.length]);

  // Restore state when navigating back from rule browser
  useEffect(() => {
    if (location.state?.scenario) {
      setScenario(location.state.scenario);
      setResponse(location.state.response);
      setAppliedRules(location.state.appliedRules);
    }
  }, [location.state]);

  // Generate dynamic placeholder examples
  useEffect(() => {
    const examples = [
      "I have a team member who consistently misses deadlines and it's affecting our project deliverables. How should I address this situation professionally?",
      "My colleague takes credit for my ideas in meetings. What's the best way to handle this?",
      "I'm struggling to balance multiple priorities at work. How can I manage my time better?",
      "A client is being unreasonable with their demands. How should I set boundaries?",
      "I need to give critical feedback to my manager. What's the best approach?"
    ];
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % examples.length;
      setPlaceholderExample(examples[currentIndex]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const generateRandomScenario = () => {
    const randomScenarios = [
      "I have a team member who consistently misses deadlines and it's affecting our project deliverables. How should I address this situation professionally?",
      "My colleague takes credit for my ideas in meetings. What's the best way to handle this?",
      "I'm struggling to balance multiple priorities at work. How can I manage my time better?",
      "A close friend always cancels plans at the last minute. How should I address this without damaging our friendship?",
      "I want to start exercising regularly but can't seem to stick to a routine. What approach should I take?",
      "I've been procrastinating on an important personal project for months. How do I overcome this?",
      "My friend is going through a tough time, but I don't know how to help. What's the best way to support them?",
      "I spend too much time on social media and it's affecting my productivity. How can I break this habit?",
      "I want to learn a new skill but feel overwhelmed by where to start. What should I do?",
      "A family member constantly criticizes my life choices. How should I set boundaries?",
      "I'm feeling stuck in my personal growth and unsure of my next steps. How do I move forward?",
      "I started a new hobby but I'm not progressing as fast as I'd like. Should I keep going or try something else?",
      "My sleep schedule is a mess and it's affecting everything. How can I fix this?",
      "I have a hard time saying no to people and end up overcommitted. How do I change this pattern?",
      "I want to be more consistent with reading but always end up choosing TV instead. What can I do?",
      "A friend borrowed money and hasn't paid me back. How should I bring this up?",
      "I'm trying to eat healthier but keep falling back into old habits. What's a sustainable approach?",
      "I feel like I'm not making meaningful connections with people. How can I build deeper friendships?",
      "I made a significant mistake on a project. How do I own up to it?",
      "I'm comparing myself to others on social media and feeling inadequate. How do I stop this?"
    ];
    
    const randomIndex = Math.floor(Math.random() * randomScenarios.length);
    setScenario(randomScenarios[randomIndex]);
  };

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
    setAppliedRules([]);

    try {
      const url = `https://script.google.com/macros/s/AKfycbyx2TTjP2RTu8Rncnxos2gVl2ZB86AnrMYrceBwi1kDetjgHaKBgyf-h3yglWHAaTT9Lg/exec?scenario=${encodeURIComponent(scenario)}`;

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
        
        const rulesUsed = (data.rules_used && Array.isArray(data.rules_used) && data.rules_used.length > 0) 
          ? data.rules_used 
          : [];
        
        setAppliedRules(rulesUsed);
        
        // Save guidance record to database
        try {
          const ruleTitles = rulesUsed.map((rule: any) => rule.title);
          const { data: insertedData, error: insertError } = await supabase
            .from('guidance_records')
            .insert({
              scenario: scenario.trim(),
              guidance: data.reply,
              applied_rules: ruleTitles
            })
            .select('id')
            .single();
          
          if (!insertError && insertedData) {
            setCurrentGuidanceId(insertedData.id);
            setRating(null); // Reset rating for new guidance
          }
        } catch (dbError) {
          console.error('Error saving guidance record:', dbError);
          // Don't show error to user, just log it
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
      setAppliedRules([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (ratingValue: 'Liked' | 'Not Liked') => {
    if (!currentGuidanceId) return;

    try {
      const { error } = await supabase
        .from('guidance_records')
        .update({ rating: ratingValue })
        .eq('id', currentGuidanceId);

      if (error) throw error;

      setRating(ratingValue);
      toast({
        title: "Thank you!",
        description: "Your feedback has been recorded"
      });
    } catch (error) {
      console.error('Error saving rating:', error);
      toast({
        title: "Error",
        description: "Failed to save your rating",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        <Navigation currentPage="home" />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3" style={{ color: 'hsl(0 0% 85%)' }}>Find the perfec™ baby step forward</h1>
          <p className="text-xl text-muted-foreground">Then go one better and find a #1 rule for life</p>
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
              placeholder={placeholderExample}
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
              {loading ? "Scanning #1 rules for perfec™ guidance..." : "Get perfec™ guidance"}
            </Button>
            
            <div className="mt-3 px-4">
              <Button
                onClick={generateRandomScenario}
                disabled={loading}
                variant="ghost"
                className="text-sm text-muted-foreground hover:text-foreground whitespace-normal h-auto py-2"
              >
                I'm too lazy to come up with a scenario, let AI replace me for a bit and generate one
              </Button>
            </div>
            
            {loading && (
              <div className="mt-4 flex items-center justify-center gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Scanning #1 rules for perfec™ guidance...</span>
              </div>
            )}
          </div>
          
          {response && (
            <div className="bg-muted/50 rounded-lg p-8 border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-accent" />
                Perfec™ Guidance
              </h2>
              
              <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {response}
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 mb-6 shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  How would you rate this response?
                </h3>
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={() => handleRating('Liked')}
                    variant={rating === 'Liked' ? 'default' : 'outline'}
                    className="flex items-center gap-2"
                    disabled={rating !== null}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    {rating === 'Liked' ? 'Liked' : 'Like'}
                  </Button>
                  <Button
                    onClick={() => handleRating('Not Liked')}
                    variant={rating === 'Not Liked' ? 'default' : 'outline'}
                    className="flex items-center gap-2"
                    disabled={rating !== null}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    {rating === 'Not Liked' ? 'Not Liked' : 'Dislike'}
                  </Button>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  #1 Rules Applied
                </h3>
                <div className="text-foreground leading-relaxed space-y-4">
                  {appliedRules.length > 0 ? (
                    appliedRules.map((rule: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <button
                          onClick={() => navigate(`/rules?search=${encodeURIComponent(rule.title)}`)}
                          className="font-bold text-primary hover:underline text-left"
                        >
                          • {rule.title}
                        </button>
                        <div className="pl-4 text-muted-foreground">
                          {rule.reason}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No guidelines information available</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Perfec™ Cycling Bullets */}
        <div className="mt-8 bg-white rounded-lg p-8 border border-border shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
            What is perfec™?
          </h2>
          <div className="relative h-20 flex items-center justify-center overflow-hidden">
            {perfecBullets.map((bullet, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center px-4 transition-opacity duration-1000 ${
                  index === currentPerfecBullet ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-lg text-muted-foreground text-center italic">
                  Perfec™ is {bullet}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ScenarioHelper;