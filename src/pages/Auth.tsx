
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

enum AuthMode {
  SIGN_IN,
  SIGN_UP
}

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>(AuthMode.SIGN_IN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/");
      }
    };
    
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === AuthMode.SIGN_IN) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in."
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split("@")[0],
            },
          },
        });

        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Welcome to our chat application."
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.SIGN_IN ? AuthMode.SIGN_UP : AuthMode.SIGN_IN);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FF7E5F] to-[#FEB47B] p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {mode === AuthMode.SIGN_IN ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === AuthMode.SIGN_IN
              ? "Sign in to continue to the chat"
              : "Sign up to start chatting"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === AuthMode.SIGN_UP && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name (Optional)
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === AuthMode.SIGN_IN ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF7E5F] to-[#FEB47B] hover:opacity-90"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : mode === AuthMode.SIGN_IN
              ? "Sign In"
              : "Create Account"}
          </Button>
        </form>

        <div className="text-center">
          <Separator className="my-4" />
          <button
            type="button"
            onClick={toggleMode}
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            {mode === AuthMode.SIGN_IN
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
