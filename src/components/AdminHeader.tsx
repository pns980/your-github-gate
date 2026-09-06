import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import PerfecLogotype from "@/components/PerfecLogotype";

const AdminHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header data-admin-header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:px-8">
      <Link to="/dashboard" className="flex items-center gap-3 lg:hidden">
        <PerfecLogotype className="h-6" />
        <span className="text-xs font-semibold uppercase">Admin</span>
      </Link>
      <div className="hidden lg:block">
        <p className="eyebrow">Number One Rules</p>
        <p className="text-sm text-muted-foreground">Administration workspace</p>
      </div>
      {user && (
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden max-w-56 truncate text-xs text-muted-foreground sm:block">{user.email}</span>
          <Button onClick={handleSignOut} variant="outline" size="sm"><LogOut /> Sign Out</Button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;