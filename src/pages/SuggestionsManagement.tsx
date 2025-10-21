import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Suggestion {
  id: string;
  created_at: string;
  title: string;
  description: string;
  area: string[];
  discipline: string;
  skill: string;
}

const SuggestionsManagement = () => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: suggestions, loading, refetch } = useSupabaseQuery<Suggestion>({
    queryFn: async () => {
      const result = await supabase.from("suggestions").select("*").order("created_at", { ascending: false });
      return result;
    },
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("suggestions").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Suggestion deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to delete suggestion",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminNavigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Suggestions Management</h1>
              <p className="text-muted-foreground mt-2">
                Review and manage rule suggestions submitted by users
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading suggestions...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No suggestions submitted yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{suggestion.title}</CardTitle>
                        <CardDescription>
                          Submitted on {new Date(suggestion.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === suggestion.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Suggestion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this suggestion? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(suggestion.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Description:</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {suggestion.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Area:</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.area.map((area) => (
                              <Badge key={area} variant="secondary">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Discipline:</p>
                          <Badge variant="outline">{suggestion.discipline}</Badge>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Skill:</p>
                          <Badge variant="outline">{suggestion.skill}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default SuggestionsManagement;
