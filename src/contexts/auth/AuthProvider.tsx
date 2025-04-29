
import React, { useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { db } from "@/integrations/supabase/typedClient";
import { AuthContext } from "./AuthContext";
import { fetchUserProfile, createBasicUserFromSession } from "./utils";
import { Session } from "@supabase/supabase-js";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("AuthProvider initialized");

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    const { data: { subscription } } = db.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      setSession(session);
      
      // Important: Use this pattern to avoid issues with Supabase auth callbacks
      if (session?.user) {
        // First, set basic user info synchronously
        const basicUser = createBasicUserFromSession(session);
        setUser(basicUser);
        
        // Force admin role for the admin email
        if (session.user.email === 'admin@africau.edu') {
          console.log("Admin user detected, setting admin role");
          setUser(prev => prev ? {...prev, role: 'admin'} : null);
        }
        
        // Then fetch profile asynchronously using setTimeout to avoid potential deadlocks
        setTimeout(async () => {
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              // Ensure admin email always has admin role regardless of what's in the DB
              if (session.user.email === 'admin@africau.edu') {
                profile.role = 'admin';
              }
              setUser(profile);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Keep using the basic user object on error
          }
        }, 0);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await db.auth.getSession();
        
        setSession(session);
        
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          
          // First set basic user info synchronously
          const basicUser = createBasicUserFromSession(session);
          
          // Force admin role for the admin email
          if (session.user.email === 'admin@africau.edu') {
            console.log("Admin user detected, setting admin role");
            basicUser.role = 'admin';
          }
          
          setUser(basicUser);
          
          // Then fetch profile asynchronously
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              console.log("User profile loaded:", profile);
              // Ensure admin email always has admin role regardless of what's in the DB
              if (session.user.email === 'admin@africau.edu') {
                profile.role = 'admin';
              }
              setUser(profile);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            // Keep using the basic user object on error
          }
        } else {
          console.log("No existing session found");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt for:", email);
    setIsLoading(true);
    try {
      const { data, error } = await db.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }

      if (data?.user) {
        console.log("Login successful for:", data.user.email);
        // Create a basic user object right away
        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.name || "User",
          email: data.user.email || "",
          role: (data.user.user_metadata?.role as UserRole) || "researcher",
          profileImage: "/placeholder.svg"
        });
        toast.success("Login successful");
        return;
      }

      throw new Error("No user returned from authentication");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log("Logout attempt");
    setIsLoading(true);
    try {
      await db.auth.signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    console.log("Registration attempt for:", email);
    setIsLoading(true);
    try {
      // Admin can create both admin and grant_office roles
      // Regular users can only self-register as researchers
      if (role !== "researcher" && (!user || user.role !== "admin")) {
        throw new Error("Only administrators can create staff accounts");
      }

      if (!email.endsWith('@africau.edu')) {
        throw new Error("Please use your Africa University email (@africau.edu)");
      }
      
      const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
        }
      });

      if (error) throw error;
      
      if (user && user.role === "admin" && role !== user.role) {
        toast.success("Registration successful. User account is pending approval.");
      } else {
        toast.success("Registration successful. Your account is pending approval.");
      }
      
      console.log("Registration successful for:", { name, email, role });
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthCache = async () => {
    try {
      await db.auth.signOut();
      setUser(null);
      localStorage.removeItem('supabase.auth.token');
      toast.success("Authentication cache cleared successfully");
    } catch (error) {
      console.error("Error clearing auth cache:", error);
      toast.error("Failed to clear authentication cache");
    }
  };

  const createAdmin = async (password: string) => {
    setIsLoading(true);
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
      return true;
    } catch (error: any) {
      console.error("Error creating admin account:", error);
      toast.error(error.message || "Failed to create admin account");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    clearAuthCache,
    createAdmin
  };

  console.log("AuthProvider rendering with auth state:", { user: !!user, isLoading });
  console.log("Current user role:", user?.role);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
