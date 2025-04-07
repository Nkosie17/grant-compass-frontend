
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
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Transform the data to match our User type
      const transformedUsers: User[] = data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Unnamed User',
        email: profile.email || 'No Email',
        role: profile.role || 'researcher',
        department: profile.department || 'Unassigned',
        // For now, we'll set all users as active since we don't have this info
        status: 'active',
        // Similarly, we don't have last login info yet
        lastLogin: 'Unknown',
      }));
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
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
            <AddUserForm onUserAdded={() => {
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
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-3">Department</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div 
                        key={user.id}
                        className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                      >
                        <div className="col-span-3 font-medium flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div>{user.name}</div>
                            <div className="text-muted-foreground text-xs">{user.email}</div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline" className="capitalize">
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="col-span-3">{user.department || 'Not assigned'}</div>
                        <div className="col-span-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            user.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : user.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No users found matching your filters.
                    </div>
                  )}
                </div>
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
