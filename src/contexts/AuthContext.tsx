
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
  clearAuthCache: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  console.log("AuthProvider initialized");

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    const { data: { subscription } } = db.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (session?.user) {
        try {
          const { data: profile, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            // Instead of setting user to null, create a basic user from session
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || "User",
              email: session.user.email || "",
              role: (session.user.user_metadata?.role as UserRole) || "researcher",
              profileImage: "/placeholder.svg"
            });
          } else if (profile) {
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
          // Same fallback as above, don't set user to null
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || "User",
            email: session.user.email || "",
            role: (session.user.user_metadata?.role as UserRole) || "researcher",
            profileImage: "/placeholder.svg"
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session } } = await db.auth.getSession();
        if (session?.user) {
          console.log("Found existing session for user:", session.user.id);
          try {
            const { data: profile, error } = await db
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("Error fetching user profile:", error);
              // Instead of setting user to null, create a basic user from session
              setUser({
                id: session.user.id,
                name: session.user.user_metadata?.name || "User",
                email: session.user.email || "",
                role: (session.user.user_metadata?.role as UserRole) || "researcher",
                profileImage: "/placeholder.svg"
              });
            } else if (profile) {
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
          } catch (error) {
            console.error("Error initializing auth:", error);
            // Fallback to session user data
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || "User",
              email: session.user.email || "",
              role: (session.user.user_metadata?.role as UserRole) || "researcher",
              profileImage: "/placeholder.svg"
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
        console.log("Login successful for:", data.user.email);
        // Create a basic user object even if profile fetch fails
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

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    clearAuthCache
  };

  console.log("AuthProvider rendering with auth state:", { user: !!user, isLoading });
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
