
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Plus, Search, UserPlus, Users, X, Loader2 } from "lucide-react";
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

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string | null;
  status: string;
  lastLogin: string;
};

const UserManagementPage: React.FC = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const { user } = useAuth();
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        // Fallback to fetching only the current session if admin API fails
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          // If we at least have the current user's session, show that
          const sessionUser = sessionData.session.user;
          const userData: User = {
            id: sessionUser.id,
            name: sessionUser.user_metadata.name || 'Unknown User',
            email: sessionUser.email || 'No Email',
            role: sessionUser.user_metadata.role || 'researcher',
            department: sessionUser.user_metadata.department || 'Unassigned',
            status: 'active',
            lastLogin: new Date(sessionUser.last_sign_in_at || '').toLocaleString() || 'Unknown',
          };
          setUsers([userData]);
          console.log("Showing only current user due to permission restrictions:", userData);
        } else {
          throw new Error("Could not fetch user data");
        }
      } else if (users) {
        // If admin API works, transform the full list
        const transformedUsers: User[] = users.map(user => ({
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
                            <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default UserManagementPage;
