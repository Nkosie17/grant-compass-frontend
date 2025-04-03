
export type UserRole = "researcher" | "grant_office" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  profileImage?: string;
}
