
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/auth";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
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

  useEffect(() => {
    // Check for stored user in localStorage (simulating persistent session)
    const storedUser = localStorage.getItem("au_gms_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("au_gms_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For testing purposes, allow any user to log in with any password
      // Just check if the email ends with @africau.edu
      if (email.endsWith('@africau.edu')) {
        // Check if a demo user with this email exists
        let matchedUser = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        // If no matching demo user, create a temporary one
        if (!matchedUser) {
          matchedUser = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email: email,
            password: password,
            role: "researcher" as UserRole,
            department: "Unspecified",
            profileImage: "/placeholder.svg"
          };
        }
        
        // Create user object without password
        const { password: _, ...userWithoutPassword } = matchedUser;
        setUser(userWithoutPassword);
        localStorage.setItem("au_gms_user", JSON.stringify(userWithoutPassword));
      } else {
        throw new Error("Please use your Africa University email (@africau.edu)");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("au_gms_user");
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email has the right domain
      if (!email.endsWith('@africau.edu')) {
        throw new Error("Please use your Africa University email (@africau.edu)");
      }
      
      // For testing, automatically allow registration and login
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
        department: "Unspecified",
        profileImage: "/placeholder.svg"
      };
      
      // Auto-login after registration
      setUser(newUser);
      localStorage.setItem("au_gms_user", JSON.stringify(newUser));
      
      console.log("Registration successful for:", { name, email, role });
    } catch (error) {
      console.error("Registration failed:", error);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
