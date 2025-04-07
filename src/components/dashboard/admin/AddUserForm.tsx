
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";

const AddUserForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<UserRole>("grant_office");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith('@africau.edu')) {
      toast.error("Please use an Africa University email address (@africau.edu)");
      return;
    }
    
    setIsSubmitting(true);

    try {
      await register(name, email, password, role);
      toast.success("User successfully created.");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
      setRole("grant_office");
      
      // Notify parent component if needed
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="Jane Smith"
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
          placeholder="jane.smith@africau.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">Must be an Africa University email</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Temporary Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">User will be asked to change this</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          placeholder="Research Administration"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={role} 
          onValueChange={(value) => setRole(value as UserRole)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grant_office">Grant Office Staff</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {role === "admin" ? 
            "Administrators have full access to the system" : 
            "Grant office staff can manage grants and opportunities"
          }
        </p>
      </div>
      
      <div className="pt-2 flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (onSuccess) onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
