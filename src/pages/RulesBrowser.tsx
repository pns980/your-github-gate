import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, RefreshCw, Settings } from "lucide-react";
import { Rule } from "@/types/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const RulesBrowser = () => {
  const navigate = useNavigate();
  const [rulesData, setRulesData] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
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
    } catch (error) {
      console.error('Error loading rules:', error);
      setRulesData([]);
    }
  };

  const applyFilters = () => {
    const filtered = rulesData.filter(rule => {
      const title = rule.title || '';
      const description = rule.description || '';
      const q = searchTerm.toLowerCase();
      const matchesSearch = !q || title.toLowerCase().includes(q) || description.toLowerCase().includes(q);

      let matchesArea = selectedArea === 'All Areas';
      if (!matchesArea && rule.area) {
        const areas = rule.area.toLowerCase().split(';').map(a => a.trim());
        matchesArea = areas.includes(selectedArea.toLowerCase());
      }

      let matchesDiscipline = selectedDiscipline === 'All Disciplines';
      if (!matchesDiscipline && rule.discipline) {
        matchesDiscipline = rule.discipline.toLowerCase().trim() === selectedDiscipline.toLowerCase();
      }

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

  return (
    <div className="min-h-screen gradient-bg p-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <Link to="/">
            <Button variant="outline" className="bg-white/90 hover:bg-white border-border">
              <Home className="mr-2 h-4 w-4" />
              Scenario Helper
            </Button>
          </Link>
          <Link to="/review">
            <Button variant="outline" className="bg-white/90 hover:bg-white border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rule Review
            </Button>
          </Link>
          <Button 
            onClick={() => navigate('/rules/manage')} 
            variant="outline" 
            className="bg-white/90 hover:bg-white border-border ml-auto"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Rules
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-3">Rules Browser</h1>
          <p className="text-xl text-muted-foreground">100 practical rules for managing people, business, and yourself</p>
        </div>
        
        {/* Filters Card */}
        <div className="bg-card rounded-lg p-8 mb-10 border border-border shadow-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules by title or content..."
            className="max-w-2xl mx-auto mb-8"
          />
          
          <div className="space-y-6">
            <div>
              <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-3">Area</h3>
              <div className="flex flex-wrap gap-3">
                {['All Areas', 'People', 'Self', 'Business'].map((area) => (
                  <Button
                    key={area}
                    onClick={() => setSelectedArea(area)}
                    variant={selectedArea === area ? "default" : "outline"}
                    className={selectedArea === area ? "bg-primary text-primary-foreground" : ""}
                  >
                    {area}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-3">Discipline</h3>
              <div className="flex flex-wrap gap-3">
                {['All Disciplines', 'Perception', 'Will', 'Action'].map((discipline) => (
                  <Button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(discipline)}
                    variant={selectedDiscipline === discipline ? "default" : "outline"}
                    className={selectedDiscipline === discipline ? "bg-primary text-primary-foreground" : ""}
                  >
                    {discipline}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-foreground text-sm font-semibold uppercase tracking-wider mb-3">Skill</h3>
              <div className="flex flex-wrap gap-3">
                {['All Skills', 'Communication', 'Teamwork', 'Analytical skills', 'Empathy', 'Work ethic', 'Leadership', 'Self-management'].map((skill) => (
                  <Button
                    key={skill}
                    onClick={() => setSelectedSkill(skill)}
                    variant={selectedSkill === skill ? "default" : "outline"}
                    className={selectedSkill === skill ? "bg-primary text-primary-foreground" : ""}
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
              >
                Reset All Filters
              </Button>
            </div>
          </div>
          
          <div className="mt-5 text-center text-muted-foreground text-sm">
            Showing {filteredRules.length} of {rulesData.length} rules
          </div>
        </div>
        
        {/* Rules Grid */}
        {filteredRules.length === 0 ? (
          <div className="text-center text-muted-foreground text-2xl mt-20 p-10 bg-card rounded-lg border border-border">
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
                  className="bg-card rounded-lg p-8 shadow-lg border border-border transition-all hover:shadow-xl"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rule.area && rule.area.split(';').map((area, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-secondary text-secondary-foreground">
                        {area.trim()}
                      </span>
                    ))}
                    {rule.discipline && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-secondary text-secondary-foreground">
                        {rule.discipline}
                      </span>
                    )}
                    {rule.skill && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase bg-secondary text-secondary-foreground">
                        {rule.skill}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                    {rule.title || 'Untitled'}
                  </h3>
                  
                  {isExpanded && (
                    <div className="text-muted-foreground text-sm leading-relaxed mb-4 text-justify">
                      {rule.description || 'No description available.'}
                    </div>
                  )}
                  
                  <Button
                    onClick={() => toggleCard(cardKey)}
                    className={isExpanded ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : "bg-primary text-primary-foreground hover:bg-primary/90"}
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