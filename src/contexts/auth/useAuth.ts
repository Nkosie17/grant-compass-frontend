
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  // Additional logging to help debug auth issues
  if (context.user) {
    console.log("useAuth hook - Current user role:", context.user.role);
  } else {
    console.log("useAuth hook - No user logged in");
  }
  
  return context;
};
