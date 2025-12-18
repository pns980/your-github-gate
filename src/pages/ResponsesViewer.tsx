import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";

interface RuleResponse {
  id: string;
  rule_title: string;
  resonates: boolean;
  applicable: boolean;
  learned_new: boolean;
  thoughts: string;
  created_at: string;
}

const ResponsesViewer = () => {
  const [selectedResponse, setSelectedResponse] = useState<RuleResponse | null>(null);
  
  const { data: responses, loading, refetch: loadResponses } = useSupabaseQuery<RuleResponse>({
    queryFn: async () => {
      const result = await supabase
        .from("rule_responses")
        .select("*")
        .order("created_at", { ascending: false });
      return result;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    try {
      const { error } = await supabase
        .from("rule_responses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      loadResponses();
    } catch (error) {
      console.error("Error deleting response:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <AdminNavigation />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Rule Responses</h1>
            <Button onClick={loadResponses}>Refresh</Button>
          </div>

        {responses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No responses yet.
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Title</TableHead>
                  <TableHead>Resonates</TableHead>
                  <TableHead>Applicable</TableHead>
                  <TableHead>Learned New</TableHead>
                  <TableHead>Thoughts</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response) => (
                  <TableRow key={response.id}>
                    <TableCell className="font-medium">
                      {response.rule_title}
                    </TableCell>
                    <TableCell>
                      {response.resonates ? "✓ Yes" : "✗ No"}
                    </TableCell>
                    <TableCell>
                      {response.applicable ? "✓ Yes" : "✗ No"}
                    </TableCell>
                    <TableCell>
                      {response.learned_new ? "✓ Yes" : "✗ No"}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex items-center gap-2">
                        <div className="line-clamp-2 flex-1">{response.thoughts}</div>
                        {response.thoughts && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedResponse(response)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(response.created_at), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(response.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Footer />
      
      <Dialog open={!!selectedResponse} onOpenChange={() => setSelectedResponse(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          {selectedResponse && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Rule Title</h4>
                <p>{selectedResponse.rule_title}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Resonates</h4>
                  <p>{selectedResponse.resonates ? "✓ Yes" : "✗ No"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Applicable</h4>
                  <p>{selectedResponse.applicable ? "✓ Yes" : "✗ No"}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Learned New</h4>
                  <p>{selectedResponse.learned_new ? "✓ Yes" : "✗ No"}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Full Thoughts</h4>
                <p className="whitespace-pre-wrap">{selectedResponse.thoughts || "No thoughts provided"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground">Date</h4>
                <p>{format(new Date(selectedResponse.created_at), "MMM d, yyyy HH:mm")}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
    </>
  );
};

export default ResponsesViewer;
