
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, getDemoCredentials } = useAuth();
  const navigate = useNavigate();
  const demoCredentials = getDemoCredentials();
  
  // Map roles to more readable formats for display
  const roleLabels: Record<UserRole, string> = {
    researcher: "Researcher",
    grant_office: "Grant Office Staff",
    admin: "Administrator"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in the login function
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    
    try {
      setIsSubmitting(true);
      await login(demoEmail, demoPassword);
      navigate("/dashboard");
    } catch (error) {
      // Error is already handled in the login function
      console.error(error);
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
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
            </TabsContent>

            <TabsContent value="demo">
              <div className="space-y-4">
                <p className="text-sm text-center text-muted-foreground">
                  Click on any of the demo accounts below to login instantly:
                </p>
                
                {demoCredentials.map((cred) => (
                  <Card key={cred.email} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge className="mb-2" variant={
                            cred.role === "admin" ? "destructive" : 
                            cred.role === "grant_office" ? "outline" : "secondary"
                          }>
                            {roleLabels[cred.role]}
                          </Badge>
                          <div className="font-medium">{cred.name}</div>
                          <div className="text-xs text-muted-foreground">{cred.email}</div>
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleDemoLogin(cred.email, cred.password)}
                          disabled={isSubmitting}
                        >
                          Log in
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
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
