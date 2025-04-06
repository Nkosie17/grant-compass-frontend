
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
            
            {/* Grant Application Feature */}
            <Route path="/grant-application" element={
              <DashboardLayout>
                <GrantApplicationForm />
              </DashboardLayout>
            } />
            
            <Route path="/new-application" element={
              <DashboardLayout>
                <GrantApplicationForm />
              </DashboardLayout>
            } />
            
            <Route path="/grant-review/:grantId" element={
              <DashboardLayout>
                <GrantReviewForm />
              </DashboardLayout>
            } />

            <Route path="/create-opportunity" element={
              <DashboardLayout>
                <CreateOpportunityForm />
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
            
            {/* New Pages */}
            <Route path="/notifications" element={
              <DashboardLayout>
                <NotificationsPage />
              </DashboardLayout>
            } />
            
            <Route path="/settings" element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            } />
            
            <Route path="/reports" element={
              <DashboardLayout>
                <ReportsPage />
              </DashboardLayout>
            } />
            
            <Route path="/calendar" element={
              <DashboardLayout>
                <CalendarPage />
              </DashboardLayout>
            } />
            
            <Route path="/reporting" element={
              <DashboardLayout>
                <ReportingPage />
              </DashboardLayout>
            } />
            
            <Route path="/proposals" element={
              <DashboardLayout>
                <ProposalsPage />
              </DashboardLayout>
            } />
            
            <Route path="/finance" element={
              <DashboardLayout>
                <FinancePage />
              </DashboardLayout>
            } />
            
            <Route path="/applications" element={
              <DashboardLayout>
                <ApplicationsPage />
              </DashboardLayout>
            } />
            
            <Route path="/admin-settings" element={
              <DashboardLayout>
                <AdminSettingsPage />
              </DashboardLayout>
            } />
            
            <Route path="/users" element={
              <DashboardLayout>
                <UserManagementPage />
              </DashboardLayout>
            } />
            
            <Route path="/system-reports" element={
              <DashboardLayout>
                <SystemReportsPage />
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
