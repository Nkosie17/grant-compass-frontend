
import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { db } from "@/integrations/supabase/typedClient";
import { seedDatabase } from "@/utils/seedData";

const SetupPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [seedingDatabase, setSeedingDatabase] = useState(false);
  const navigate = useNavigate();

  // Check if admin user exists
  useEffect(() => {
    const checkAdminUser = async () => {
      try {
        const { count, error } = await db
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin');

        if (error) {
          throw error;
        }

        setAdminExists(count ? count > 0 : false);
      } catch (error) {
        console.error("Error checking admin user:", error);
        toast.error("Failed to check system status");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Call the create-admin edge function
      const response = await fetch("https://jdsmyhemzlaccwptgpda.supabase.co/functions/v1/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@africau.edu",
          password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create admin user");
      }

      const data = await response.json();
      
      toast.success("Admin account created successfully");
      toast.info("You can now log in with admin@africau.edu");
      
      // After creating admin, seed the database
      setSeedingDatabase(true);
      const seedResult = await seedDatabase();
      if (seedResult) {
        toast.success("Database seeded with sample data");
      } else {
        toast.error("Failed to seed database with sample data");
      }
      
      // Redirect to login page with a message
      navigate("/login", { 
        state: { message: "Admin account created. You can now log in with admin@africau.edu" }
      });
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsSubmitting(false);
      setSeedingDatabase(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-au-purple"></div>
      </div>
    );
  }

  // If admin already exists, redirect to home
  if (adminExists) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-au-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">System Setup</CardTitle>
          <CardDescription className="text-center">
            Create your administrator account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTitle>Initial Setup Required</AlertTitle>
            <AlertDescription>
              This is a one-time setup to create the administrator account for the Africa University Grant Management System.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value="admin@africau.edu"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                This is the fixed admin email for the system
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                Choose a secure password for the admin account
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-au-purple hover:bg-au-purple-dark"
              disabled={isSubmitting || seedingDatabase}
            >
              {isSubmitting ? "Creating Admin Account..." : 
               seedingDatabase ? "Seeding Database..." : 
               "Create Admin Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already set up?{" "}
            <a 
              onClick={(e) => { e.preventDefault(); navigate("/login"); }} 
              className="text-au-purple hover:underline cursor-pointer"
            >
              Sign in here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SetupPage;
