
import { User, UserRole } from "@/types/auth";
import { Session } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  clearAuthCache: () => Promise<void>;
  createAdmin: (password: string) => Promise<boolean>;
};
