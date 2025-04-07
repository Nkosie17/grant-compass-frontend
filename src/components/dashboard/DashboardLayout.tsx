
import React, { Suspense } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  
  try {
    const { user, isAuthenticated, isLoading } = useAuth();
    
    console.log("DashboardLayout auth state:", { isAuthenticated, isLoading });

    // If auth is still loading, show nothing or a loader
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-au-purple"></div>
        </div>
      );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      console.log("Not authenticated, redirecting to login");
      return <Navigate to="/login" state={{ message: "Please sign in to access this page" }} replace />;
    }

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </SidebarProvider>
    );
  } catch (error) {
    console.error("Auth context error:", error);
    // Redirect to login if there's an error with auth context
    return <Navigate to="/login" state={{ message: "Session error. Please sign in again." }} replace />;
  }
};

export default DashboardLayout;
