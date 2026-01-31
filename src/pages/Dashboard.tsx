import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, FileText, Mail, MessageSquare } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";

interface WeeklyStats {
  guidance: number;
  responses: number;
  messages: number;
  suggestions: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<WeeklyStats>({
    guidance: 0,
    responses: 0,
    messages: 0,
    suggestions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    setLoading(true);
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weekAgoISO = oneWeekAgo.toISOString();

      const [guidanceResult, responsesResult, messagesResult, suggestionsResult] = await Promise.all([
        supabase
          .from("guidance_records")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgoISO),
        supabase
          .from("rule_responses")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgoISO),
        supabase
          .from("contact_submissions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgoISO),
        supabase
          .from("suggestions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", weekAgoISO),
      ]);

      setStats({
        guidance: guidanceResult.count || 0,
        responses: responsesResult.count || 0,
        messages: messagesResult.count || 0,
        suggestions: suggestionsResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Guidance Records",
      value: stats.guidance,
      description: "Generated this week",
      icon: Lightbulb,
    },
    {
      title: "Rule Responses",
      value: stats.responses,
      description: "Submitted this week",
      icon: FileText,
    },
    {
      title: "Contact Messages",
      value: stats.messages,
      description: "Received this week",
      icon: Mail,
    },
    {
      title: "Rule Suggestions",
      value: stats.suggestions,
      description: "Submitted this week",
      icon: MessageSquare,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Overview of activity from the last 7 days
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading statistics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <CardDescription className="text-xs">
                        {card.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
