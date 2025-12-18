import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type AuthMode = "login" | "forgot" | "reset";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this is a password reset callback
  useEffect(() => {
    const url = new URL(window.location.href);

    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = url.searchParams.get("type") ?? hashParams.get("type");

    // Password recovery links may arrive as either query params (PKCE) or hash params (implicit)
    const isRecovery =
      type === "recovery" ||
      url.searchParams.has("code") ||
      url.searchParams.has("token") ||
      hashParams.has("access_token");

    if (isRecovery) {
      setMode("reset");
      return; // Don't redirect if in recovery mode
    }

    // Only check for existing session if not in recovery mode
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      navigate("/");
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a password reset link.",
      });
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been successfully reset.",
      });

      setMode("login");
      navigate("/auth");
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

  const renderLoginForm = () => (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={() => setMode("forgot")}
      >
        Forgot password?
      </Button>
    </form>
  );

  const renderForgotForm = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={() => setMode("login")}
      >
        Back to login
      </Button>
    </form>
  );

  const renderResetForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );

  const getCardContent = () => {
    switch (mode) {
      case "forgot":
        return {
          title: "Reset Password",
          description: "Enter your email to receive a reset link",
          form: renderForgotForm(),
        };
      case "reset":
        return {
          title: "Set New Password",
          description: "Enter your new password",
          form: renderResetForm(),
        };
      default:
        return {
          title: "Admin Login",
          description: "Sign in to access the admin panel",
          form: renderLoginForm(),
        };
    }
  };

  const cardContent = getCardContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{cardContent.title}</CardTitle>
          <CardDescription>{cardContent.description}</CardDescription>
        </CardHeader>
        <CardContent>{cardContent.form}</CardContent>
      </Card>
    </div>
  );
};

export default Auth;
