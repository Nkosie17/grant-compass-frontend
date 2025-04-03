
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Landing and Authentication Pages
import LandingPage from "@/components/LandingPage";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

// Dashboard Components
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ResearcherDashboard from "@/components/dashboard/researcher/ResearcherDashboard";
import GrantOfficeDashboard from "@/components/dashboard/grant-office/GrantOfficeDashboard";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

// Feature Pages
import OpportunitiesList from "@/components/opportunities/OpportunitiesList";
import MyGrants from "@/components/grants/MyGrants";
import NotFound from "@/components/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            } />
            
            {/* Feature Pages */}
            <Route path="/opportunities" element={
              <DashboardLayout>
                <OpportunitiesList />
              </DashboardLayout>
            } />
            
            <Route path="/my-grants" element={
              <DashboardLayout>
                <MyGrants />
              </DashboardLayout>
            } />
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Role-based dashboard router
const DashboardRouter = () => {
  const DashboardComponent = () => {
    const role = localStorage.getItem("au_gms_user") ? 
      JSON.parse(localStorage.getItem("au_gms_user")!).role : null;
    
    switch (role) {
      case "researcher":
        return <ResearcherDashboard />;
      case "grant_office":
        return <GrantOfficeDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        // Fallback to researcher dashboard if role is unknown
        return <ResearcherDashboard />;
    }
  };
  
  return <DashboardComponent />;
};

export default App;
