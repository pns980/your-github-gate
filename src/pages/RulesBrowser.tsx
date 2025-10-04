import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import { Rule } from "@/types/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6qXXzzJj-5ulyAqOBxL33j8CyUc9CiVxl3sD15ItgbHRhF-z5FLFxsY7Ue8b1Gd2t/exec';

const fallbackData: Rule[] = [
  {
    title: "Think for yourself.",
    description: "No №1 Rule carries more irony and universality as this one which basically says that there are no universal rules, no forever truths. Each of us is right for themselves at each given moment, even if we contradict ourselves from a moment ago. There's no universal judge to deliberate and guide us but our internal moral compass. It may sound liberating, but I see it as the ultimate burden of responsibility. For practical purposes (i.e. to avoid an internal fundamental philosophical debate for each of our million plus decisions made every day) developing a set of decision rules in some shape or form is probably advisable. At this point, I feel relatively confident having built a solid foundation and if any of it resonates and spares a person from overanalyzing agony - it's a wonderful bonus. But sharing it with others almost felt compulsive despite my belief in the only thing that ultimately works - to think for yourself. Good luck to us all with that."
  },
  {
    title: "You can't improve what you can't measure",
    description: "A brief story from professional experience: After 4-5 relatively flat years, we broke the barrier and returned to steady growth mode. What changed? We finally set up measurements of utilization, revenue per capita, receivables, etc. Average overall satisfaction increased in 5 years from 3.81/5.00 and reached 4.13/5.00 far surpassing our target of 4.00. What made the difference? Detailed engagement survey covering management, team leads, roles, career development, available resources, etc. And the same principle applied in personal life: Around the 40th birthday the time had come to start thinking about retirement. The plan required as input detailed data on income, expenses and desired standard of living, output would be a detailed retirement plan. A close-to-final was done in about an hour. How? A detailed family budget diligently kept for over 10 years. What aspects of your habits, skills, personal life or business do you believe are worth enhancing? Make measurement the initial step toward reaching the next level of improvement."
  }
];

const RulesBrowser = () => {
  const navigate = useNavigate();
  const [rulesData, setRulesData] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [loadStatus, setLoadStatus] = useState('');


  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, rulesData]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await loadDataWithJSONP();
      if (Array.isArray(data) && data.length > 0) {
        setRulesData(data);
        setLoadStatus(`Successfully loaded ${data.length} rules from Google Sheets!`);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      setRulesData(fallbackData);
      setLoadStatus(`Could not load from Google Sheets. Showing ${fallbackData.length} sample rules instead.`);
    } finally {
      setLoading(false);
    }
  };

  const loadDataWithJSONP = (): Promise<Rule[]> => {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      const timestamp = Date.now();
      
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout'));
      }, 15000);
      
      (window as any)[callbackName] = function(data: Rule[]) {
        cleanup();
        resolve(data);
      };
      
      function cleanup() {
        clearTimeout(timeoutId);
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
        }
      }
      
      const script = document.createElement('script');
      script.onerror = function() {
        cleanup();
        reject(new Error('Failed to load data'));
      };
      
      script.src = `${SCRIPT_URL}?callback=${callbackName}&_=${timestamp}`;
      document.head.appendChild(script);
    });
  };

  const applyFilters = () => {
    const filtered = rulesData.filter(rule => {
      const matchesSearch = !searchTerm || 
        rule.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        rule.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    setFilteredRules(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-5">
        <div className="text-center text-white">
          <div className="text-5xl mb-4 animate-spin">📊</div>
          <div className="text-xl">Loading your rules from Google Sheets...</div>
          <div className="text-sm opacity-70 mt-2">This may take a few seconds</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Home className="mr-2 h-4 w-4" />
              Back to Scenario Helper
            </Button>
          </Link>
          <Button 
            onClick={() => navigate('/rules/manage')} 
            variant="outline" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/30"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Rules
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-white text-5xl mb-4 font-light drop-shadow-lg">📋 No. 1 Rules</h1>
          <p className="text-white/90 text-xl font-light">100 practical rules for managing people, business, and yourself</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-10 border border-white/20 shadow-xl">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules by title or content..."
            className="max-w-[600px] mx-auto bg-white/95 border-none rounded-full px-6 py-5 text-base shadow-lg"
          />
          
          {loadStatus && (
            <div className="mt-5 text-center text-white/80 text-sm">{loadStatus}</div>
          )}
          
          <div className="mt-5 text-center text-white/80 text-sm font-light">
            Showing {filteredRules.length} of {rulesData.length} rules
          </div>
        </div>
        
        {filteredRules.length === 0 ? (
          <div className="text-center text-white/80 text-2xl mt-20 p-10 bg-white/10 rounded-3xl backdrop-blur-md">
            <h3 className="mb-2">No rules found matching your criteria.</h3>
            <p className="text-lg">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredRules.map((rule, index) => {
              const isExpanded = expandedCards.has(index);
              
              return (
                <div
                  key={index}
                  className="bg-white/95 rounded-3xl p-8 shadow-xl backdrop-blur-md border border-white/30 transition-all hover:translate-y-[-8px] hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                    {rule.title || 'Untitled'}
                  </h3>
                  
                  {isExpanded && (
                    <div className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">
                      {rule.description || 'No description available.'}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => toggleCard(index)}
                    className={`rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wide transition-all ${
                      isExpanded
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg text-white'
                        : 'bg-gradient-to-r from-primary to-accent hover:shadow-lg text-white'
                    }`}
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RulesBrowser;
