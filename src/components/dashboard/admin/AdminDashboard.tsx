
import React from "react";
import { Link } from "react-router-dom";
import { ALL_GRANTS } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Settings, Shield, BarChart2, Bell, UserPlus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const AdminDashboard: React.FC = () => {
  // Simulate system statistics
  const stats = {
    activeUsers: 124,
    newUsers: 8,
    pendingApprovals: 5,
    grantApplications: ALL_GRANTS.length,
    activeGrants: ALL_GRANTS.filter(grant => grant.status === "active").length,
    securityAlerts: 2
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="System Administration"
        subtitle="Manage users, monitor system, and configure settings"
      />
      
      <div className="p-6 flex-1">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" className="w-full bg-au-purple hover:bg-au-purple-dark mb-2">
                <Link to="/users/new">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Add a new system user</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" variant="outline" className="w-full mb-2">
                <Link to="/admin-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">Configure system parameters</p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Button asChild size="lg" variant="outline" className="w-full mb-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <Link to="/security-logs">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Logs
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                {stats.securityAlerts > 0 ? (
                  <span className="text-red-600">{stats.securityAlerts} alerts requiring attention</span>
                ) : (
                  "View system security logs"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.activeUsers}</div>
              <p className="text-sm text-muted-foreground">
                +{stats.newUsers} new this week
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                User Approvals
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
              <div className="text-3xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-sm text-muted-foreground">
                Pending account approvals
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.grantApplications}</div>
              <p className="text-sm text-muted-foreground">
                Total applications ({stats.activeGrants} active)
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-au-neutral-50">
                        <td className="p-2">John Researcher</td>
                        <td className="p-2">researcher@au.edu</td>
                        <td className="p-2">Researcher</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-au-neutral-50">
                        <td className="p-2">Sarah Grant Officer</td>
                        <td className="p-2">grants@au.edu</td>
                        <td className="p-2">Grant Office</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Disable</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-au-neutral-50">
                        <td className="p-2">New User</td>
                        <td className="p-2">newuser@au.edu</td>
                        <td className="p-2">Researcher</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button size="sm">Approve</Button>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">Reject</Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/users">Manage All Users</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system performance and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Server Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">CPU Usage</span>
                          <span className="text-green-600 text-sm">Normal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-right">35%</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Memory Usage</span>
                          <span className="text-yellow-600 text-sm">Moderate</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-right">65%</div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Disk Space</span>
                          <span className="text-green-600 text-sm">Normal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                        <div className="mt-1 text-xs text-right">42%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent System Events</h3>
                    <div className="border rounded-lg divide-y">
                      <div className="p-3 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">Daily backup completed successfully</p>
                          <p className="text-xs text-muted-foreground">Today, 03:15 AM</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">System update scheduled</p>
                          <p className="text-xs text-muted-foreground">Tomorrow, 01:00 AM</p>
                        </div>
                      </div>
                      <div className="p-3 flex items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">Database optimization completed</p>
                          <p className="text-xs text-muted-foreground">Yesterday, 11:30 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Overview</CardTitle>
                <CardDescription>Monitor and manage system security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Security Alerts</h3>
                    {stats.securityAlerts > 0 ? (
                      <div className="border border-red-200 rounded-lg divide-y divide-red-100">
                        <div className="p-4 bg-red-50">
                          <div className="flex items-start">
                            <Shield className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                            <div>
                              <h4 className="font-medium text-red-700">Multiple failed login attempts</h4>
                              <p className="text-sm text-red-600 mt-1">
                                Multiple failed login attempts detected for user account: admin@au.edu
                              </p>
                              <div className="mt-3">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">Investigate</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-red-50">
                          <div className="flex items-start">
                            <Shield className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                            <div>
                              <h4 className="font-medium text-red-700">Unusual access pattern detected</h4>
                              <p className="text-sm text-red-600 mt-1">
                                Unusual access pattern detected from IP 203.0.113.45
                              </p>
                              <div className="mt-3">
                                <Button size="sm" className="bg-red-600 hover:bg-red-700">Investigate</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 text-center text-muted-foreground">
                        <Shield className="h-8 w-8 mx-auto mb-2" />
                        <p>No active security alerts</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Login Activity</h3>
                    <div className="border rounded-lg divide-y">
                      <div className="p-3 flex justify-between">
                        <div>
                          <p className="text-sm font-medium">admin@au.edu</p>
                          <p className="text-xs text-muted-foreground">IP: 192.168.1.1</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Successful login</p>
                          <p className="text-xs text-muted-foreground">Today, 10:23 AM</p>
                        </div>
                      </div>
                      <div className="p-3 flex justify-between">
                        <div>
                          <p className="text-sm font-medium">researcher@au.edu</p>
                          <p className="text-xs text-muted-foreground">IP: 192.168.1.45</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Successful login</p>
                          <p className="text-xs text-muted-foreground">Today, 09:17 AM</p>
                        </div>
                      </div>
                      <div className="p-3 flex justify-between">
                        <div>
                          <p className="text-sm font-medium">grants@au.edu</p>
                          <p className="text-xs text-muted-foreground">IP: 192.168.2.10</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Successful login</p>
                          <p className="text-xs text-muted-foreground">Yesterday, 04:46 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/security-logs">View Complete Security Logs</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
