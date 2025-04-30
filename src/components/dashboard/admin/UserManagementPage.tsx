
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Plus, Search, UserPlus, Users, X, Loader2, Edit, UserCog } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddUserForm from "./AddUserForm";
import { useAuth } from "@/contexts/auth/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/integrations/supabase/typedClient";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  status: string;
  lastLogin: string;
};

type EditUserDialogProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, open, onOpenChange, onSave }) => {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [department, setDepartment] = useState(user.department || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update user metadata in auth
      const { error: authError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { name, role, department } }
      );
      
      if (authError) throw authError;
      
      // Also update the profile table if it exists
      const { error: profileError } = await db
        .from('profiles')
        .update({
          name,
          role,
          department
        })
        .eq('id', user.id);
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
        // Continue anyway as the auth update succeeded
      }
      
      toast.success("User updated successfully");
      onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(`Failed to update user: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user details and permissions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid w-full items-center gap-2">
            <label htmlFor="role" className="text-sm font-medium">Role</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              required
            >
              <option value="researcher">Researcher</option>
              <option value="grant_office">Grant Office</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="grid w-full items-center gap-2">
            <label htmlFor="department" className="text-sm font-medium">Department</label>
            <Input 
              id="department" 
              value={department} 
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const UserManagementPage: React.FC = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Function to fetch users from both auth API and profiles table
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // First try to get users from the auth API (requires admin role)
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      // If that fails, fetch profiles from the database
      if (authError) {
        console.error("Error fetching users from auth API:", authError);
        const { data: profilesData, error: profilesError } = await db
          .from('profiles')
          .select('*');
          
        if (profilesError) throw profilesError;
        
        if (profilesData) {
          const transformedProfiles: User[] = profilesData.map(profile => ({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            department: profile.department,
            status: 'active', // Assume active since we can't determine from profiles alone
            lastLogin: 'Unknown',
          }));
          
          setUsers(transformedProfiles);
        }
      } else if (authData?.users) {
        // Transform the auth users data
        const transformedUsers: User[] = authData.users.map(user => ({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown User',
          email: user.email || 'No Email',
          role: user.user_metadata?.role || 'researcher',
          department: user.user_metadata?.department || 'Unassigned',
          status: user.banned ? 'banned' : user.confirmed_at ? 'active' : 'pending',
          lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never',
        }));
        
        setUsers(transformedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Using session data if available.");
      
      // Fallback to current user session if available
      if (user) {
        const userData: User = {
          id: user.id,
          name: user.name || 'Current User',
          email: user.email || 'No Email',
          role: user.role || 'researcher',
          department: user.department || 'Unassigned',
          status: 'active',
          lastLogin: 'Current session',
        };
        setUsers([userData]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRoleFilter = roleFilter === null || user.role === roleFilter;
    const matchesStatusFilter = statusFilter === null || user.status === statusFilter;
    
    return matchesSearch && matchesRoleFilter && matchesStatusFilter;
  });

  const removeFilter = (type: 'role' | 'status') => {
    if (type === 'role') {
      setRoleFilter(null);
    } else {
      setStatusFilter(null);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 mr-2 text-[#cf2e2e]" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button variant="red" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new account for grant office staff or administrators.
              </DialogDescription>
            </DialogHeader>
            <AddUserForm onSuccess={() => {
              setIsAddUserOpen(false);
              fetchUsers(); // Refresh the user list after adding a user
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all-users" className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger 
              value="all-users" 
              onClick={() => setRoleFilter(null)}
            >
              All Users
            </TabsTrigger>
            <TabsTrigger 
              value="researchers" 
              onClick={() => setRoleFilter("researcher")}
            >
              Researchers
            </TabsTrigger>
            <TabsTrigger 
              value="administrators"
              onClick={() => setRoleFilter("admin")}
            >
              Staff & Admins
            </TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Manage users and permissions
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {statusFilter && (
                  <Badge variant="outline" className="flex gap-1 items-center">
                    Status: {statusFilter}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFilter('status')}
                    />
                  </Badge>
                )}
                {roleFilter && (
                  <Badge variant="outline" className="flex gap-1 items-center">
                    Role: {roleFilter.replace('_', ' ')}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFilter('role')}
                    />
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-muted-foreground text-xs">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.department || 'Not assigned'}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              user.status === "active" 
                                ? "bg-green-100 text-green-800" 
                                : user.status === "banned"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="flex items-center gap-1"
                            >
                              <UserCog className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {selectedUser && (
        <EditUserDialog 
          user={selectedUser}
          open={isEditUserOpen}
          onOpenChange={setIsEditUserOpen}
          onSave={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
