import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Upload, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Rule {
  id: string;
  title: string;
  description: string;
  area?: string;
  discipline?: string;
  skill?: string;
}

const RulesManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    area: "",
    discipline: "",
    skill: "",
  });
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRule) {
        const { error } = await supabase
          .from("rules")
          .update(formData)
          .eq("id", editingRule.id);

        if (error) throw error;
        toast({ title: "Success", description: "Rule updated successfully" });
      } else {
        const { error } = await supabase.from("rules").insert([formData]);

        if (error) throw error;
        toast({ title: "Success", description: "Rule added successfully" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;

    try {
      const { error } = await supabase.from("rules").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Success", description: "Rule deleted successfully" });
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title,
      description: rule.description,
      area: rule.area || "",
      discipline: rule.discipline || "",
      skill: rule.skill || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingRule(null);
    setFormData({
      title: "",
      description: "",
      area: "",
      discipline: "",
      skill: "",
    });
  };

  const parseCSV = (text: string, delimiter: string = ','): string[][] => {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        // Field separator
        currentRow.push(currentField.trim());
        currentField = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        // Row separator (outside quotes)
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n in \r\n
        }
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          if (currentRow.some(field => field)) { // Only add non-empty rows
            rows.push(currentRow);
          }
          currentRow = [];
          currentField = '';
        }
      } else {
        currentField += char;
      }
    }
    
    // Push last field and row
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field)) {
        rows.push(currentRow);
      }
    }
    
    return rows;
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      
      // Detect delimiter (semicolon or comma)
      const firstLine = text.split(/\r?\n/)[0];
      const delimiter = firstLine.includes(';') ? ';' : ',';
      
      const rows = parseCSV(text, delimiter);
      
      if (rows.length === 0) {
        throw new Error("CSV file is empty");
      }
      
      const headers = rows[0].map((h) => h.trim().toLowerCase());
      const rules = [];

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i];
        const rule: any = {};

        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          if (header === "title") rule.title = value;
          if (header === "description") rule.description = value;
          if (header === "area") rule.area = value;
          if (header === "discipline") rule.discipline = value;
          if (header === "skill") rule.skill = value;
        });

        // Only add rules with required fields (title and description)
        if (rule.title && rule.description) {
          rules.push(rule);
        }
      }

      if (rules.length === 0) {
        throw new Error("No valid rules found in CSV file");
      }

      const { error } = await supabase.from("rules").insert(rules);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Imported ${rules.length} rules successfully`,
      });
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    e.target.value = "";
  };

  const loadDataWithJSONP = (): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw6qXXzzJj-5ulyAqOBxL33j8CyUc9CiVxl3sD15ItgbHRhF-z5FLFxsY7Ue8b1Gd2t/exec';
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      const timestamp = Date.now();
      
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('Request timeout'));
      }, 15000);
      
      (window as any)[callbackName] = function(data: any[]) {
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

  const handleGoogleSheetsImport = async () => {
    if (!confirm("This will import all rules from Google Sheets. Continue?")) return;
    
    setImporting(true);
    try {
      const data = await loadDataWithJSONP();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No data received from Google Sheets');
      }

      const normalizeText = (val: any) => typeof val === 'string' ? val.trim() : (val == null ? '' : String(val).trim());

      const rules = data.map((r: any) => ({
        title: normalizeText(r.title ?? r.Title ?? r.TITLE),
        description: normalizeText(
          r.description ?? r.fullDescription ?? r.FullDescription ?? r.FULLDESCRIPTION ?? r.Description ?? r.DESCRIPTION
        ),
        area: normalizeText(r.area ?? r.Area ?? r.AREA) || null,
        discipline: normalizeText(r.discipline ?? r.Discipline ?? r.DISCIPLINE) || null,
        skill: normalizeText(r.skill ?? r.Skill ?? r.SKILL) || null,
      })).filter((rule: any) => rule.title && rule.description);

      if (rules.length === 0) {
        throw new Error('No valid rules found in Google Sheets');
      }

      const { error } = await supabase.from("rules").insert(rules);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Imported ${rules.length} rules from Google Sheets`,
      });
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL rules? This action cannot be undone!")) return;
    
    if (!confirm("This will permanently delete all rules. Are you absolutely sure?")) return;

    try {
      const { error } = await supabase.from("rules").delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;
      toast({ title: "Success", description: "All rules deleted successfully" });
      fetchRules();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/rules")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Rules Management</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
            </Button>
            <Button 
              variant="outline" 
              onClick={handleGoogleSheetsImport}
              disabled={importing}
            >
              <Download className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import from Google Sheets"}
            </Button>
            <Button variant="outline" asChild>
              <label htmlFor="csv-import" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
                <input
                  id="csv-import"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                />
              </label>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingRule ? "Edit Rule" : "Add New Rule"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="area">Area</Label>
                      <Select
                        value={formData.area}
                        onValueChange={(value) =>
                          setFormData({ ...formData, area: value })
                        }
                      >
                        <SelectTrigger id="area">
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="People">People</SelectItem>
                          <SelectItem value="Self">Self</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="discipline">Discipline</Label>
                      <Select
                        value={formData.discipline}
                        onValueChange={(value) =>
                          setFormData({ ...formData, discipline: value })
                        }
                      >
                        <SelectTrigger id="discipline">
                          <SelectValue placeholder="Select discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="Perception">Perception</SelectItem>
                          <SelectItem value="Will">Will</SelectItem>
                          <SelectItem value="Action">Action</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="skill">Skill</Label>
                      <Select
                        value={formData.skill}
                        onValueChange={(value) =>
                          setFormData({ ...formData, skill: value })
                        }
                      >
                        <SelectTrigger id="skill">
                          <SelectValue placeholder="Select skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="Communication">Communication</SelectItem>
                          <SelectItem value="Teamwork">Teamwork</SelectItem>
                          <SelectItem value="Analytical skills">Analytical skills</SelectItem>
                          <SelectItem value="Empathy">Empathy</SelectItem>
                          <SelectItem value="Work ethic">Work ethic</SelectItem>
                          <SelectItem value="Leadership">Leadership</SelectItem>
                          <SelectItem value="Self-management">Self-management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingRule ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Discipline</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No rules yet. Add your first rule, import from CSV, or import from Google Sheets.
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium max-w-xs">{rule.title}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          {rule.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{rule.area || "-"}</TableCell>
                      <TableCell className="text-sm">{rule.discipline || "-"}</TableCell>
                      <TableCell className="text-sm">{rule.skill || "-"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(rule)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground max-w-6xl mx-auto">
        <Link to="/contact" className="hover:text-primary">Contact</Link>
      </footer>
    </div>
  );
};

export default RulesManagement;
