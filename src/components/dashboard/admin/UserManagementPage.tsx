
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Filter, Plus, Search, UserPlus, Users, X } from "lucide-react";
import AddUserForm from "./AddUserForm";

const UserManagementPage: React.FC = () => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@africauni.edu",
      role: "researcher",
      department: "Computer Science",
      status: "active",
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@africauni.edu",
      role: "grant_office",
      department: "Research Administration",
      status: "active",
      lastLogin: "1 day ago",
    },
    {
      id: 3,
      name: "David Lee",
      email: "david.lee@africauni.edu",
      role: "researcher",
      department: "Engineering",
      status: "active",
      lastLogin: "3 days ago",
    },
    {
      id: 4,
      name: "Sarah Thompson",
      email: "sarah.t@africauni.edu",
      role: "researcher",
      department: "Medicine",
      status: "inactive",
      lastLogin: "2 weeks ago",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@africauni.edu",
      role: "admin",
      department: "IT Services",
      status: "active",
      lastLogin: "5 hours ago",
    },
    {
      id: 6,
      name: "Emma Wilson",
      email: "emma.w@africauni.edu",
      role: "researcher",
      department: "Agriculture",
      status: "pending",
      lastLogin: "Never",
    },
  ];

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
            <AddUserForm />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all-users" className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
            <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="researchers">Researchers</TabsTrigger>
            <TabsTrigger value="administrators">Staff & Admins</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                className="pl-8 w-full"
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
                <Badge variant="outline" className="flex gap-1 items-center">
                  Status: Active
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
                <Badge variant="outline" className="flex gap-1 items-center">
                  Role: Researcher
                  <X className="h-3 w-3 cursor-pointer" />
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-3">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Last Login</div>
                <div className="col-span-1">Actions</div>
              </div>
              {users.map((user) => (
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
                  <div className="col-span-2">{user.department}</div>
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
                  <div className="col-span-2">{user.lastLogin}</div>
                  <div className="col-span-1">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing <strong>1-6</strong> of <strong>42</strong> users
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <TabsContent value="researchers">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Users className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium">Researcher Management</h3>
            <p className="text-sm max-w-md mb-4">
              Filter and manage researcher accounts, research groups, and permissions.
            </p>
            <Button variant="outline">View Researchers</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="administrators">
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium">Administrator Management</h3>
            <p className="text-sm max-w-md mb-4">
              Manage system administrators and permission levels.
            </p>
            <Button variant="outline">View Administrators</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagementPage;
