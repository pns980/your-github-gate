import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Settings } from "lucide-react";
import { Rule } from "@/types/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const RulesBrowser = () => {
  const navigate = useNavigate();
  const [rulesData, setRulesData] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [loadStatus, setLoadStatus] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All Disciplines');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');


  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, rulesData, selectedArea, selectedDiscipline, selectedSkill]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .order('title');
      
      if (error) throw error;
      
      const rules: Rule[] = (data || []).map(r => ({
        title: r.title,
        description: r.description,
        area: r.area || undefined,
        discipline: r.discipline || undefined,
        skill: r.skill || undefined,
      }));
      
      setRulesData(rules);
      setLoadStatus(`Successfully loaded ${rules.length} rules from database!`);
    } catch (error) {
      console.error('Error loading rules:', error);
      setRulesData([]);
      setLoadStatus('Could not load rules from database.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = rulesData.filter(rule => {
      // Search filter
      const title = rule.title || '';
      const description = rule.description || '';
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || title.toLowerCase().includes(q) || description.toLowerCase().includes(q);

      // Area can be multiple values separated by semicolons
      let matchesArea = selectedArea === 'All Areas';
      if (!matchesArea && rule.area) {
        const areas = rule.area.toLowerCase().split(';').map(a => a.trim());
        matchesArea = areas.includes(selectedArea.toLowerCase());
      }

      // Discipline single value
      let matchesDiscipline = selectedDiscipline === 'All Disciplines';
      if (!matchesDiscipline && rule.discipline) {
        matchesDiscipline = rule.discipline.toLowerCase().trim() === selectedDiscipline.toLowerCase();
      }

      // Skill single value
      let matchesSkill = selectedSkill === 'All Skills';
      if (!matchesSkill && rule.skill) {
        matchesSkill = rule.skill.toLowerCase().trim() === selectedSkill.toLowerCase();
      }

      return matchesSearch && matchesArea && matchesDiscipline && matchesSkill;
    });
    
    setFilteredRules(filtered);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('All Areas');
    setSelectedDiscipline('All Disciplines');
    setSelectedSkill('All Skills');
  };

  const toggleCard = (title: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
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
          <div className="text-xl">Loading your rules...</div>
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
          
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-3">Area</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['All Areas', 'People', 'Self', 'Business'].map((area) => (
                  <Button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    variant={selectedArea === area ? "default" : "outline"}
                    className={selectedArea === area 
                      ? "bg-white text-primary hover:bg-white/90" 
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-3">Discipline</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['All Disciplines', 'Perception', 'Will', 'Action'].map((discipline) => (
                  <Button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(discipline)}
                    variant={selectedDiscipline === discipline ? "default" : "outline"}
                    className={selectedDiscipline === discipline 
                      ? "bg-white text-primary hover:bg-white/90" 
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
                  >
                    {discipline}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-3">Skill</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {['All Skills', 'Communication', 'Teamwork', 'Analytical skills', 'Empathy', 'Work ethic', 'Leadership', 'Self-management'].map((skill) => (
                  <Button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    className={selectedSkill === skill 
                      ? "bg-white text-primary hover:bg-white/90" 
                      : "bg-white/10 text-white border-white/30 hover:bg-white/20"}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                🔄 Reset All Filters
              </Button>
            </div>
          </div>
          
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
              const cardKey = rule.title || `rule-${index}`;
              const isExpanded = expandedCards.has(cardKey);
              
              return (
                <div
                  key={index}
                  className="bg-white/95 rounded-3xl p-8 shadow-xl backdrop-blur-md border border-white/30 transition-all hover:translate-y-[-8px] hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rule.area && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-red-500 text-white">
                        {rule.area}
                      </span>
                    )}
                    {rule.discipline && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-teal-500 text-white">
                        {rule.discipline}
                      </span>
                    )}
                    {rule.skill && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-emerald-500 text-white">
                        {rule.skill}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                    {rule.title || 'Untitled'}
                  </h3>
                  
                  {isExpanded && (
                    <div className="text-gray-600 text-sm leading-relaxed mb-4 text-justify">
                      {rule.description || 'No description available.'}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => toggleCard(cardKey)}
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
