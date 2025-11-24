import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminHeader from "@/components/AdminHeader";
import AdminNavigation from "@/components/AdminNavigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PageContent {
  id: string;
  page_name: string;
  section_key: string;
  content: string;
}

const PagesManagement = () => {
  const queryClient = useQueryClient();
  const [editingContent, setEditingContent] = useState<Record<string, string>>({});

  const { data: pageContents, isLoading } = useQuery({
    queryKey: ["pages-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages_content")
        .select("*")
        .order("page_name", { ascending: true })
        .order("section_key", { ascending: true });

      if (error) throw error;
      return data as PageContent[];
    },
  });

  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { error } = await supabase
        .from("pages_content")
        .update({ content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages-content"] });
      toast.success("Content updated successfully");
      setEditingContent({});
    },
    onError: (error) => {
      toast.error("Failed to update content: " + error.message);
    },
  });

  const handleContentChange = (id: string, value: string) => {
    setEditingContent((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (item: PageContent) => {
    const newContent = editingContent[item.id] ?? item.content;
    updateContentMutation.mutate({ id: item.id, content: newContent });
  };

  const groupedContent = pageContents?.reduce((acc, item) => {
    if (!acc[item.page_name]) {
      acc[item.page_name] = [];
    }
    acc[item.page_name].push(item);
    return acc;
  }, {} as Record<string, PageContent[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <AdminNavigation />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <AdminNavigation />
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Pages Content Management</h1>
        <p className="text-muted-foreground">
          Edit the static text content that appears across the website.
        </p>

        {groupedContent && Object.entries(groupedContent).map(([pageName, contents]) => (
          <Card key={pageName}>
            <CardHeader>
              <CardTitle className="capitalize">{pageName} Page</CardTitle>
              <CardDescription>
                Manage content sections for the {pageName} page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contents.map((item) => (
                <div key={item.id} className="space-y-2 border-b pb-4 last:border-b-0">
                  <label className="text-sm font-medium text-foreground capitalize">
                    {item.section_key.replace(/_/g, " ")}
                  </label>
                  <Textarea
                    value={editingContent[item.id] ?? item.content}
                    onChange={(e) => handleContentChange(item.id, e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    onClick={() => handleSave(item)}
                    disabled={updateContentMutation.isPending}
                    size="sm"
                  >
                    {updateContentMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PagesManagement;
