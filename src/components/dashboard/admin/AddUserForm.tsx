
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";
import { useAuth } from "@/contexts/auth/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type AddUserFormProps = {
  onSuccess?: () => void;
};

const AddUserForm: React.FC<AddUserFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("researcher");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!email.endsWith('@africau.edu')) {
      toast.error("Please use an Africa University email address (@africau.edu)");
      return;
    }
    
    // Only admin can create grant_office or admin accounts
    if (role !== "researcher" && (!user || user.role !== "admin")) {
      toast.error("Only administrators can create staff accounts");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password, role);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("researcher");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@africau.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      {user?.role === "admin" && (
        <div className="space-y-2">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="researcher">Researcher</SelectItem>
              <SelectItem value="grant_office">Grant Office</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button
        type="submit"
        className="w-full"
        variant="red"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating User...
          </>
        ) : (
          "Create User"
        )}
      </Button>
    </form>
  );
};

export default AddUserForm;
