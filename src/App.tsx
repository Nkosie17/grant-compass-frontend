
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import React from "react";

// New role-based routing components
import { RequireAuth, RequireRole } from "./routes/ProtectedRoutes";

// Landing and Authentication Pages
import LandingPage from "@/components/LandingPage";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import SetupPage from "@/pages/Setup";

// Dashboard Components
import ResearcherDashboard from "@/components/dashboard/researcher/ResearcherDashboard";
import GrantOfficeDashboard from "@/components/dashboard/grant-office/GrantOfficeDashboard";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";

// Feature Pages
import OpportunitiesList from "@/components/opportunities/OpportunitiesList";
import MyGrants from "@/components/grants/MyGrants";
import GrantApplicationForm from "@/components/grants/GrantApplicationForm";
import CreateOpportunityForm from "@/components/grants/CreateOpportunityForm";
import GrantReviewForm from "@/components/grants/GrantReviewForm";
import NotFound from "@/components/NotFound";

// New pages
import NotificationsPage from "@/components/dashboard/notifications/NotificationsPage";
import SettingsPage from "@/components/dashboard/settings/SettingsPage";
import ReportsPage from "@/components/dashboard/researcher/ReportsPage";
import CalendarPage from "@/components/dashboard/researcher/CalendarPage";
import ReportingPage from "@/components/dashboard/grant-office/ReportingPage";
import ProposalsPage from "@/components/dashboard/grant-office/ProposalsPage";
import FinancePage from "@/components/dashboard/grant-office/FinancePage";
import ApplicationsPage from "@/components/dashboard/grant-office/ApplicationsPage";
import AdminSettingsPage from "@/components/dashboard/admin/AdminSettingsPage";
import UserManagementPage from "@/components/dashboard/admin/UserManagementPage";
import SystemReportsPage from "@/components/dashboard/admin/SystemReportsPage";

// New IP and Agreements management
import IntellectualPropertyPage from "@/components/dashboard/ip/IntellectualPropertyPage";
import AgreementsPage from "@/components/dashboard/agreements/AgreementsPage";

// Fix: Import useAuth correctly
import { useAuth } from "@/contexts/auth/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/setup" element={<SetupPage />} />
            
            {/* Protected Routes - Authentication required */}
            <Route element={<RequireAuth />}>
              {/* Dashboard Routes with Role-Based Access */}
              <Route path="/dashboard" element={
                <Routes>
                  <Route path="/" element={<Navigate to="" replace />} />
                  <Route 
                    path="/researcher" 
                    element={<RequireRole allowedRoles={['researcher']} />} 
                    children={[
                      <Route index element={<ResearcherDashboard />} />
                    ]} 
                  />
                  <Route 
                    path="/grant-office" 
                    element={<RequireRole allowedRoles={['grant_office']} />} 
                    children={[
                      <Route index element={<GrantOfficeDashboard />} />
                    ]} 
                  />
                  <Route 
                    path="/admin" 
                    element={<RequireRole allowedRoles={['admin']} />} 
                    children={[
                      <Route index element={<AdminDashboard />} />
                    ]} 
                  />
                  <Route index element={<DashboardRouter />} />
                </Routes>
              } />
              
              {/* Common Routes for All Authenticated Users */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              
              {/* Researcher Routes */}
              <Route element={<RequireRole allowedRoles={['researcher', 'admin']} />}>
                <Route path="/my-grants" element={<MyGrants />} />
                <Route path="/opportunities" element={<OpportunitiesList />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/grant-application" element={<GrantApplicationForm />} />
                <Route path="/new-application" element={<GrantApplicationForm />} />
              </Route>
              
              {/* Grant Office Routes */}
              <Route element={<RequireRole allowedRoles={['grant_office', 'admin']} />}>
                <Route path="/reporting" element={<ReportingPage />} />
                <Route path="/proposals" element={<ProposalsPage />} />
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/create-opportunity" element={<CreateOpportunityForm />} />
                <Route path="/grant-review/:grantId" element={<GrantReviewForm />} />
                <Route path="/ip-management" element={<IntellectualPropertyPage />} />
                <Route path="/agreements" element={<AgreementsPage />} />
              </Route>
              
              {/* Admin Only Routes */}
              <Route element={<RequireRole allowedRoles={['admin']} />}>
                <Route path="/admin-settings" element={<AdminSettingsPage />} />
                <Route path="/users" element={<UserManagementPage />} />
                <Route path="/system-reports" element={<SystemReportsPage />} />
              </Route>
            </Route>
            
            {/* Catch-all 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Role-based dashboard router 
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  console.log("DashboardRouter - Current user role:", user.role);
  
  switch (user.role) {
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

export default App;
