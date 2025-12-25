import { useState, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, Trash2, Eye, Download, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import Footer from "@/components/Footer";

interface RuleResponse {
  id: string;
  rule_id: string | null;
  rule_title: string;
  resonates: boolean;
  applicable: boolean;
  learned_new: boolean;
  thoughts: string;
  created_at: string;
}

interface RuleImpression {
  id: string;
  rule_id: string;
  rule_title: string;
  action: string;
  created_at: string;
}

interface RuleStats {
  rule_title: string;
  rule_id: string | null;
  total_views: number;
  total_skips: number;
  total_reviews: number;
  resonates_yes: number;
  resonates_no: number;
  applicable_yes: number;
  applicable_no: number;
  learned_new_yes: number;
  learned_new_no: number;
  comments: RuleResponse[];
}

const ResponsesViewer = () => {
  const [selectedResponse, setSelectedResponse] = useState<RuleResponse | null>(null);
  const [selectedRuleComments, setSelectedRuleComments] = useState<RuleStats | null>(null);
  
  const { data: responses, loading: responsesLoading, refetch: loadResponses } = useSupabaseQuery<RuleResponse>({
    queryFn: async () => {
      const result = await supabase
        .from("rule_responses")
        .select("*")
        .order("created_at", { ascending: false });
      return result;
    },
  });

  const { data: impressions, loading: impressionsLoading, refetch: loadImpressions } = useSupabaseQuery<RuleImpression>({
    queryFn: async () => {
      const result = await supabase
        .from("rule_impressions")
        .select("*")
        .order("created_at", { ascending: false });
      return result;
    },
  });

  const loading = responsesLoading || impressionsLoading;

  const refetchAll = () => {
    loadResponses();
    loadImpressions();
  };

  // Aggregate statistics per rule combining impressions and responses
  // Use rule_id as the key when available, fall back to rule_title for legacy data
  const ruleStats = useMemo(() => {
    const statsMap = new Map<string, RuleStats>();
    
    const getKey = (ruleId: string | null, ruleTitle: string) => ruleId || `title:${ruleTitle}`;
    
    // First, process impressions to get view/skip counts
    impressions.forEach((impression) => {
      const key = getKey(impression.rule_id, impression.rule_title);
      const existing = statsMap.get(key);
      
      if (existing) {
        if (impression.action === 'viewed') existing.total_views++;
        else if (impression.action === 'skipped') existing.total_skips++;
        // 'reviewed' impressions are counted via responses
      } else {
        statsMap.set(key, {
          rule_title: impression.rule_title,
          rule_id: impression.rule_id,
          total_views: impression.action === 'viewed' ? 1 : 0,
          total_skips: impression.action === 'skipped' ? 1 : 0,
          total_reviews: 0,
          resonates_yes: 0,
          resonates_no: 0,
          applicable_yes: 0,
          applicable_no: 0,
          learned_new_yes: 0,
          learned_new_no: 0,
          comments: [],
        });
      }
    });
    
    // Then, process responses for review stats
    responses.forEach((response) => {
      const key = getKey(response.rule_id, response.rule_title);
      const existing = statsMap.get(key);
      
      if (existing) {
        existing.total_reviews++;
        if (response.resonates) existing.resonates_yes++;
        else existing.resonates_no++;
        if (response.applicable) existing.applicable_yes++;
        else existing.applicable_no++;
        if (response.learned_new) existing.learned_new_yes++;
        else existing.learned_new_no++;
        if (response.thoughts?.trim()) {
          existing.comments.push(response);
        }
      } else {
        // Rule has responses but no impressions (legacy data)
        statsMap.set(key, {
          rule_title: response.rule_title,
          rule_id: response.rule_id,
          total_views: 0,
          total_skips: 0,
          total_reviews: 1,
          resonates_yes: response.resonates ? 1 : 0,
          resonates_no: response.resonates ? 0 : 1,
          applicable_yes: response.applicable ? 1 : 0,
          applicable_no: response.applicable ? 0 : 1,
          learned_new_yes: response.learned_new ? 1 : 0,
          learned_new_no: response.learned_new ? 0 : 1,
          comments: response.thoughts?.trim() ? [response] : [],
        });
      }
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.total_views - a.total_views);
  }, [responses, impressions]);

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

  const exportToCSV = () => {
    if (responses.length === 0) return;

    const headers = ["Rule Title", "Resonates", "Applicable", "Learned New", "Thoughts", "Date"];
    const csvRows = [
      headers.join(","),
      ...responses.map((response) => [
        `"${response.rule_title.replace(/"/g, '""')}"`,
        response.resonates ? "Yes" : "No",
        response.applicable ? "Yes" : "No",
        response.learned_new ? "Yes" : "No",
        `"${(response.thoughts || "").replace(/"/g, '""')}"`,
        format(new Date(response.created_at), "yyyy-MM-dd HH:mm"),
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rule-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getPercentage = (value: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalViews = impressions.filter(i => i.action === 'viewed').length;
  const totalSkips = impressions.filter(i => i.action === 'skipped').length;

  return (
    <>
      <AdminHeader />
      <AdminNavigation />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Rule Responses</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToCSV} disabled={responses.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={refetchAll}>Refresh</Button>
            </div>
          </div>

          {responses.length === 0 && impressions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No responses yet.
            </div>
          ) : (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary by Rule</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4 mt-4">
                <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-4">
                  <span>{ruleStats.length} rules tracked</span>
                  <span>•</span>
                  <span>{totalViews} total views</span>
                  <span>•</span>
                  <span>{totalSkips} skips</span>
                  <span>•</span>
                  <span>{responses.length} reviews submitted</span>
                </div>
                
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Rule Title</TableHead>
                        <TableHead className="text-center">Views</TableHead>
                        <TableHead className="text-center">Skips</TableHead>
                        <TableHead className="text-center">Reviews</TableHead>
                        <TableHead className="min-w-[150px]">Resonates</TableHead>
                        <TableHead className="min-w-[150px]">Applicable</TableHead>
                        <TableHead className="min-w-[150px]">Learned New</TableHead>
                        <TableHead className="text-center">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ruleStats.map((stats) => (
                        <TableRow key={stats.rule_title}>
                          <TableCell className="font-medium">
                            {stats.rule_title}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold">{stats.total_views}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-orange-500 font-semibold">{stats.total_skips}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-green-500 font-semibold">{stats.total_reviews}</span>
                          </TableCell>
                          <TableCell>
                            {stats.total_reviews > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-green-500">Yes: {stats.resonates_yes} ({getPercentage(stats.resonates_yes, stats.total_reviews)}%)</span>
                                  <span className="text-red-500">No: {stats.resonates_no}</span>
                                </div>
                                <Progress value={getPercentage(stats.resonates_yes, stats.total_reviews)} className="h-2" />
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No reviews</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {stats.total_reviews > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-green-500">Yes: {stats.applicable_yes} ({getPercentage(stats.applicable_yes, stats.total_reviews)}%)</span>
                                  <span className="text-red-500">No: {stats.applicable_no}</span>
                                </div>
                                <Progress value={getPercentage(stats.applicable_yes, stats.total_reviews)} className="h-2" />
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No reviews</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {stats.total_reviews > 0 ? (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-green-500">Yes: {stats.learned_new_yes} ({getPercentage(stats.learned_new_yes, stats.total_reviews)}%)</span>
                                  <span className="text-red-500">No: {stats.learned_new_no}</span>
                                </div>
                                <Progress value={getPercentage(stats.learned_new_yes, stats.total_reviews)} className="h-2" />
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-xs">No reviews</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {stats.comments.length > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedRuleComments(stats)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                {stats.comments.length}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="raw" className="mt-4">
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
              </TabsContent>
            </Tabs>
          )}
        </div>

        <Footer />
        
        {/* Single Response Detail Dialog */}
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

        {/* Comments for Rule Dialog */}
        <Dialog open={!!selectedRuleComments} onOpenChange={() => setSelectedRuleComments(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Comments for: {selectedRuleComments?.rule_title}</DialogTitle>
            </DialogHeader>
            {selectedRuleComments && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {selectedRuleComments.comments.length} comment{selectedRuleComments.comments.length !== 1 ? 's' : ''} out of {selectedRuleComments.total_reviews} reviews
                </p>
                <div className="space-y-3">
                  {selectedRuleComments.comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-4">
                        <p className="whitespace-pre-wrap">{comment.thoughts}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}</span>
                          <span>Resonates: {comment.resonates ? "Yes" : "No"}</span>
                          <span>Applicable: {comment.applicable ? "Yes" : "No"}</span>
                          <span>Learned New: {comment.learned_new ? "Yes" : "No"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
