
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LocationState } from "@/types/router";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Safely access auth context with error handling
  let auth;
  try {
    auth = useAuth();
  } catch (error) {
    console.error("Auth context error in useLoginForm:", error);
    auth = {
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: async () => { throw new Error("Auth not initialized"); },
      logout: async () => { throw new Error("Auth not initialized"); },
      register: async () => { throw new Error("Auth not initialized"); },
      clearAuthCache: async () => { throw new Error("Auth not initialized"); }
    };
  }
  
  const { login, isAuthenticated, isLoading, user } = auth;
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
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
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
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
      // Ensure isSubmitting is always reset to false, even if login fails
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    loginError,
    locationMessage: locationState?.message,
    handleSubmit
  };
};
