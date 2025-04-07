
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
  } catch (error) {
    console.error("Auth context error in NotFound:", error);
    // Assume not authenticated if context error
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-au-neutral-100">
      <div className="text-center p-6">
        <div className="text-au-purple text-9xl font-bold mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-au-purple hover:bg-au-purple-dark">
            <Link to={isAuthenticated ? "/dashboard" : "/"}>
              {isAuthenticated ? "Back to Dashboard" : "Back to Home"}
            </Link>
          </Button>
          {!isAuthenticated && (
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
