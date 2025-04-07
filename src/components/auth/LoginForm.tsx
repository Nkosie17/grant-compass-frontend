
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Safely access auth context with error handling
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in LoginForm:", error);
    auth = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: async () => { throw new Error("Auth not initialized"); },
      logout: async () => { throw new Error("Auth not initialized"); },
      register: async () => { throw new Error("Auth not initialized"); }
    };
  }
  
  const { login, isAuthenticated, isLoading, user } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug console log to track auth state changes
  useEffect(() => {
    console.log("LoginForm auth state changed:", { isAuthenticated, isLoading, user });
    
    if (isAuthenticated && !isLoading && user) {
      console.log("User is authenticated, redirecting to dashboard", user);
      // Small timeout to ensure state is fully updated
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      console.log("Attempting login for:", email);
      await login(email, password);
      console.log("Login attempt complete, auth state:", { 
        isAuthenticated: auth.isAuthenticated, 
        isLoading: auth.isLoading,
        user: auth.user
      });
      
      // Manual navigation as a fallback
      if (auth.isAuthenticated && auth.user) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-au-neutral-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {location.state?.message && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertDescription>{location.state.message}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@africau.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-au-purple hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-au-purple hover:bg-au-purple-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-au-neutral-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => toast.info("SSO integration coming soon")}
            >
              AU Single Sign-On
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-au-purple hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
