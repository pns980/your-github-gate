import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Home, RefreshCw, Info } from "lucide-react";
import { Rule } from "@/types/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

const RulesBrowser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rulesData, setRulesData] = useState<Rule[]>([]);
  const [filteredRules, setFilteredRules] = useState<Rule[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || 'All Areas');
  const [selectedDiscipline, setSelectedDiscipline] = useState(searchParams.get('discipline') || 'All Disciplines');
  const [selectedSkill, setSelectedSkill] = useState(searchParams.get('skill') || 'All Skills');
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Handle opening specific rule from navigation state
  useEffect(() => {
    if (location.state?.openRuleTitle && rulesData.length > 0) {
      const titleToFind = location.state.openRuleTitle.trim().toLowerCase();
      const ruleToOpen = rulesData.find(r => 
        r.title.trim().toLowerCase() === titleToFind
      );
      if (ruleToOpen) {
        setSelectedRule(ruleToOpen);
        setIsDialogOpen(true);
        // Clear the state to prevent reopening on re-render
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, rulesData]);

  useEffect(() => {
    applyFilters();
    // Update URL with current filter state
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedArea !== 'All Areas') params.set('area', selectedArea);
    if (selectedDiscipline !== 'All Disciplines') params.set('discipline', selectedDiscipline);
    if (selectedSkill !== 'All Skills') params.set('skill', selectedSkill);
    setSearchParams(params, { replace: true });
  }, [searchTerm, rulesData, selectedArea, selectedDiscipline, selectedSkill, setSearchParams]);

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
      if (!matchesArea && rule.area && rule.area.length > 0) {
        matchesArea = rule.area.some(a => a.toLowerCase() === selectedArea.toLowerCase());
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

  const openRuleDialog = (rule: Rule) => {
    setSelectedRule(rule);
    setIsDialogOpen(true);
  };

  const handlePerfecIt = (rule: Rule) => {
    navigate('/review', { state: { rule } });
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
          <Link to="/review">
            <Button variant="outline" className="bg-white/90 hover:bg-primary hover:text-primary-foreground hover:border-primary border-border">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rule Review
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
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3" style={{ color: 'hsl(0 0% 90%)' }}>Indulge your perfec™ism</h1>
          <p className="text-xl text-muted-foreground">The complete list of almost all #1 rules.</p>
        </div>
        
        {/* Filters Card */}
        <div className="bg-card rounded-lg p-8 mb-10 border border-border shadow-lg">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter any keyword and find a related #1 rule..."
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
              
              return (
                <div
                  key={index}
                  className="bg-card rounded-lg p-6 shadow-lg border border-border transition-all hover:shadow-xl flex flex-col"
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {rule.area && rule.area.map((area, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                        style={{ 
                          backgroundColor: 'hsl(var(--tag-area))', 
                          color: 'hsl(var(--tag-area-foreground))' 
                        }}
                      >
                        {area}
                      </span>
                    ))}
                    {rule.discipline && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                        style={{ 
                          backgroundColor: 'hsl(var(--tag-discipline))', 
                          color: 'hsl(var(--tag-discipline-foreground))' 
                        }}
                      >
                        {rule.discipline}
                      </span>
                    )}
                    {rule.skill && (
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                        style={{ 
                          backgroundColor: 'hsl(var(--tag-skill))', 
                          color: 'hsl(var(--tag-skill-foreground))' 
                        }}
                      >
                        {rule.skill}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                    {rule.title || 'Untitled'}
                  </h3>
                  
                  <div className="mt-auto flex gap-2">
                    <Button
                      onClick={() => openRuleDialog(rule)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                      size="sm"
                    >
                      Read More
                    </Button>
                    <Button
                      onClick={() => handlePerfecIt(rule)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      Perfec™ it
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rule Detail Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold pr-8">
                {selectedRule?.title || 'Untitled'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {selectedRule?.description || 'No description available.'}
              </p>
            </div>
            <div className="flex gap-2 mt-6">
              <Button
                onClick={() => {
                  setIsDialogOpen(false);
                  // If we came from scenario helper, navigate back with state
                  if (location.state?.returnTo === 'scenario' && location.state?.scenarioState) {
                    navigate('/', { state: location.state.scenarioState });
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                {location.state?.returnTo === 'scenario' ? 'Back to Guidance' : 'Back to List'}
              </Button>
              <Button
                onClick={() => {
                  if (selectedRule) {
                    setIsDialogOpen(false);
                    handlePerfecIt(selectedRule);
                  }
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
              >
                Perfec™ it
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground max-w-6xl mx-auto space-x-4">
        <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary">Terms & Conditions</Link>
        <Link to="/contact" className="hover:text-primary">Contact</Link>
      </footer>
    </div>
  );
};

export default RulesBrowser;