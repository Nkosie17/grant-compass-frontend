
import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Page components
import LandingPage from "./components/LandingPage";
import NotFound from "./components/NotFound";
import RegisterForm from "./components/auth/RegisterForm";
import LoginForm from "./components/auth/LoginForm";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import SetupPage from "./pages/Setup";

// Context providers
import { AuthProvider } from "./contexts/auth";
import { createDefaultAdmin } from "./utils/createAdmin";

// Create a React Query client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Attempt to create the default admin account on app initialization
    createDefaultAdmin().then(success => {
      if (success) {
        console.log("Admin account setup complete");
      } else {
        console.error("Failed to set up admin account");
      }
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/dashboard/*" element={
              <DashboardLayout>
                {/* Dashboard content will be added later */}
              </DashboardLayout>
            } />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
