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
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import AdminHeader from "@/components/AdminHeader";
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
                      <div className="line-clamp-2">{response.thoughts}</div>
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
    </div>
    </>
  );
};

export default ResponsesViewer;
