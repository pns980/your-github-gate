import { Calendar, Mail, User, MessageSquare, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import AdminHeader from "@/components/AdminHeader";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const Messages = () => {
  const { toast } = useToast();
  const { data: messages, loading, refetch: loadMessages } = useSupabaseQuery<ContactSubmission>({
    queryFn: async () => {
      const result = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      return result;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      loadMessages();
      toast({
        title: "Success",
        description: "Message deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen gradient-bg p-8">
        <div className="max-w-6xl mx-auto">
          <Navigation />

          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-3" style={{ color: 'hsl(0 0% 85%)' }}>
              Contact Messages
            </h1>
            <p className="text-xl text-muted-foreground">
              View all contact form submissions
            </p>
          </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : messages.length === 0 ? (
          <Card className="shadow-lg bg-card">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <Card key={message.id} className="shadow-lg bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(message.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle className="text-xl">{message.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a 
                          href={`mailto:${message.email}`}
                          className="hover:text-primary hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(message.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Message
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                        {message.message}
                      </p>
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

export default Messages;
