
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { toast } from "sonner";
import { db } from "@/integrations/supabase/typedClient";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
};

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("AuthProvider initialized");

  // Initialize auth state from Supabase session
  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = db.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (session?.user) {
        try {
          // Fetch user profile from our profiles table
          const { data: profile, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error || !profile) {
            console.error("Error fetching user profile:", error);
            setUser(null);
          } else {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              department: profile.department || undefined,
              profileImage: "/placeholder.svg" // Default image
            });
          }
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await db.auth.getSession();
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          // Fetch user profile
          const { data: profile, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error || !profile) {
            console.error("Error fetching user profile:", error);
            setUser(null);
          } else {
            console.log("User profile loaded:", profile);
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              department: profile.department || undefined,
              profileImage: "/placeholder.svg" // Default image
            });
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
        // We don't need to set user here as it will be handled by the onAuthStateChange listener
        console.log("Login successful for:", data.user.email);
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
      // Auth state changes are handled by onAuthStateChange
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
      // For admin and grant_office roles, only admins should be able to create
      if (role !== "researcher" && (!user || user.role !== "admin")) {
        throw new Error("Only administrators can create staff accounts");
      }

      // Check if email has the right domain
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
      
      // If we're registering someone else (as admin), don't log in
      if (user && user.role === "admin" && role !== user.role) {
        toast.success("Registration successful. User account is pending approval.");
      } else {
        // For self-registration
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

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  console.log("AuthProvider rendering with auth state:", { user: !!user, isLoading });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Updated useAuth hook with better error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
