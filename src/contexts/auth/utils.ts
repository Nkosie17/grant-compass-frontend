
import { User, UserRole } from "@/types/auth";
import { db } from "@/integrations/supabase/typedClient";

export async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const { data: profile, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        department: profile.department || undefined,
        profileImage: "/placeholder.svg" // Default image
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export function createBasicUserFromSession(session: any): User {
  return {
    id: session.user.id,
    name: session.user.user_metadata?.name || "User",
    email: session.user.email || "",
    role: (session.user.user_metadata?.role as UserRole) || "researcher",
    profileImage: "/placeholder.svg"
  };
}
