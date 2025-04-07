
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import React, { Suspense } from "react";

// Landing and Authentication Pages
import LandingPage from "@/components/LandingPage";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import SetupPage from "@/pages/Setup";

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

// New IP and Agreements management
import IntellectualPropertyPage from "@/components/dashboard/ip/IntellectualPropertyPage";
import AgreementsPage from "@/components/dashboard/agreements/AgreementsPage";

const queryClient = new QueryClient();

// Role-based dashboard router 
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
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
            
            {/* IP and Agreement Management */}
            <Route path="/ip-management" element={
              <DashboardLayout>
                <IntellectualPropertyPage />
              </DashboardLayout>
            } />
            
            <Route path="/agreements" element={
              <DashboardLayout>
                <AgreementsPage />
              </DashboardLayout>
            } />
            
            {/* Other Pages */}
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
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
