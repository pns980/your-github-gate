import { useNavigate } from "react-router-dom";
import { RefreshCw, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface GuidanceRecord {
  id: string;
  scenario: string;
  guidance: string;
  applied_rules: string[];
  created_at: string;
  rating: string | null;
}

const GuidanceViewer = () => {
  const navigate = useNavigate();
  const { data: records, loading, refetch: loadRecords } = useSupabaseQuery<GuidanceRecord>({
    queryFn: async () => {
      const result = await supabase
        .from('guidance_records')
        .select('*')
        .order('created_at', { ascending: false });
      return result;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guidance record?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('guidance_records')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <AdminHeader />
      <AdminNavigation />
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Page Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold" style={{ color: 'hsl(0 0% 85%)' }}>Guidance Records</h1>
            <Button onClick={loadRecords} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

        {/* Records List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : records.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No guidance records found.</p>
              <p className="text-muted-foreground mt-2">Generate guidance in the Scenario Helper to see records here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
              <Card key={record.id} className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(record.created_at)}
                      </div>
                      <CardTitle className="text-xl">Scenario</CardTitle>
                    </div>
                    <Button
                      onClick={() => handleDelete(record.id)}
                      variant="destructive"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-muted-foreground italic whitespace-pre-wrap">
                      "{record.scenario}"
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Guidance</h3>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {record.guidance}
                      </p>
                    </div>
                  </div>

                  {record.applied_rules && record.applied_rules.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">#1 Rules Applied</h3>
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <ul className="space-y-2">
                          {record.applied_rules.map((ruleTitle, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary font-semibold">•</span>
                              <button
                                onClick={() => navigate('/rules', { 
                                  state: { 
                                    openRuleTitle: ruleTitle
                                  } 
                                })}
                                className="text-primary hover:underline text-left"
                              >
                                {ruleTitle}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-lg mb-2">User Rating</h3>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      {record.rating ? (
                        <div className="flex items-center gap-2">
                          {record.rating === 'Liked' ? (
                            <>
                              <ThumbsUp className="h-5 w-5 text-green-600" />
                              <span className="text-foreground font-medium">Liked</span>
                            </>
                          ) : (
                            <>
                              <ThumbsDown className="h-5 w-5 text-red-600" />
                              <span className="text-foreground font-medium">Not Liked</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No rating provided</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
    </>
  );
};

export default GuidanceViewer;
