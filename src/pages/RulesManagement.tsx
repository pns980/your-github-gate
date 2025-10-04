import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Plus, Pencil, Trash2, Upload } from "lucide-react";

interface Rule {
  id: string;
  title: string;
  description: string;
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
  });

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
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingRule(null);
    setFormData({
      title: "",
      description: "",
    });
  };

  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Push last field
    result.push(current.trim());
    return result;
  };

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/);
      const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());

      const rules = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = parseCSVLine(line);
        const rule: any = {};

        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          if (header === "title") rule.title = value;
          if (header === "description") rule.description = value;
        });

        // Only add rules with all required fields
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
            <h1 className="text-4xl font-bold">Rules Management</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All
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
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No rules yet. Add your first rule or import from CSV.
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
    </div>
  );
};

export default RulesManagement;
