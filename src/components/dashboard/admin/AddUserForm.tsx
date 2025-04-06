
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/auth";

const AddUserForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("grant_office");
  const [department, setDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate a random temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // In a real application, this would make an API call
      // For now, we'll simulate adding a user to localStorage
      const users = JSON.parse(localStorage.getItem("au_gms_users") || "[]");
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
        department,
        status: "active",
        lastLogin: "Never",
      };
      
      users.push(newUser);
      localStorage.setItem("au_gms_users", JSON.stringify(users));
      
      toast.success(`User ${name} added successfully. A temporary password has been generated.`);
      
      // Reset form
      setName("");
      setEmail("");
      setRole("grant_office");
      setDepartment("");
      
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>
          Create accounts for staff and administrators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff.email@au.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup 
              value={role} 
              onValueChange={(value) => setRole(value as UserRole)} 
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grant_office" id="grant_office" />
                <Label htmlFor="grant_office">Grant Office Staff</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Administrator</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={department} 
              onValueChange={setDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Research Administration">Research Administration</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="IT Services">IT Services</SelectItem>
                <SelectItem value="Grants Management">Grants Management</SelectItem>
                <SelectItem value="Executive Office">Executive Office</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding User..." : "Add User"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        New users will receive an email with their login credentials.
      </CardFooter>
    </Card>
  );
};

export default AddUserForm;
