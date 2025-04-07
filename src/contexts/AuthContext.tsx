
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  getDemoCredentials: () => { role: UserRole; email: string; password: string; name: string }[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data for demo purposes
const DEMO_USERS = [
  {
    id: "1",
    name: "John Researcher",
    email: "researcher@africau.edu",
    password: "password123",
    role: "researcher" as UserRole,
    department: "Computer Science",
    profileImage: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Sarah Grant Officer",
    email: "grants@africau.edu",
    password: "password123",
    role: "grant_office" as UserRole,
    department: "Research Administration",
    profileImage: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@africau.edu",
    password: "password123",
    role: "admin" as UserRole,
    department: "System Administration",
    profileImage: "/placeholder.svg"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Supabase session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          // Fetch user profile from our profiles table
          const { data: profile, error } = await supabase
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
              role: profile.role,
              department: profile.department,
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
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch user profile
          const { data: profile, error } = await supabase
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
              role: profile.role,
              department: profile.department,
              profileImage: "/placeholder.svg" // Default image
            });
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Authentication is handled by the onAuthStateChange listener
      toast.success("Login successful");
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      // Auth state changes are handled by onAuthStateChange
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
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
      
      const { data, error } = await supabase.auth.signUp({
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

  // Function to get demo credentials for display purposes
  const getDemoCredentials = () => {
    return DEMO_USERS.map(user => ({
      role: user.role,
      email: user.email,
      password: user.password,
      name: user.name
    }));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    getDemoCredentials
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
