
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Database, Shield, Bell, FileText } from "lucide-react";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-[#cf2e2e]" />
        <h1 className="text-2xl font-bold">Admin Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Basic system settings and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="Africa University Grant Management System" />
                <p className="text-xs text-muted-foreground mt-1">
                  The name displayed throughout the application.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Contact Email</Label>
                <Input id="admin-email" defaultValue="admin@au-gms.edu" />
                <p className="text-xs text-muted-foreground mt-1">
                  Primary contact email for system notifications.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fiscal-year">Current Fiscal Year</Label>
                <Input id="fiscal-year" defaultValue="2023-2024" />
                <p className="text-xs text-muted-foreground mt-1">
                  Current fiscal year for reporting purposes.
                </p>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2">
                <Label>System Access</Label>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Only administrators can access the system
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Public Registration</p>
                    <p className="text-sm text-muted-foreground">
                      Allow users to self-register for accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button variant="red">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Management
              </CardTitle>
              <CardDescription>
                Database settings and system maintenance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Database Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">Type:</p>
                      <p>PostgreSQL</p>
                      <p className="text-muted-foreground">Version:</p>
                      <p>13.4</p>
                      <p className="text-muted-foreground">Size:</p>
                      <p>1.2 GB</p>
                      <p className="text-muted-foreground">Last Backup:</p>
                      <p>Today, 03:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">System Health</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">Status:</p>
                      <p className="text-green-600 font-medium">Operational</p>
                      <p className="text-muted-foreground">Uptime:</p>
                      <p>99.9% (30 days)</p>
                      <p className="text-muted-foreground">Response Time:</p>
                      <p>120ms</p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Maintenance Tasks</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Run Database Backup
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Clear Application Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View System Logs
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Reset Demo Data
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-4 text-red-600">Danger Zone</h3>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Purge All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage system security and authentication policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Password Policy</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-pwd-length">Minimum Password Length</Label>
                      <Input id="min-pwd-length" type="number" defaultValue="8" min="6" max="24" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pwd-expiry">Password Expiry (days)</Label>
                      <Input id="pwd-expiry" type="number" defaultValue="90" min="30" max="365" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require Special Characters</p>
                        <p className="text-sm text-muted-foreground">
                          Passwords must contain special characters
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Require Mixed Case</p>
                        <p className="text-sm text-muted-foreground">
                          Passwords must contain upper and lowercase letters
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Authentication</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-muted-foreground">
                          Require 2FA for all users
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session Timeout</p>
                        <p className="text-sm text-muted-foreground">
                          Automatically log out inactive users
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" min="5" max="120" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-attempts">Max Login Attempts</Label>
                      <Input id="login-attempts" type="number" defaultValue="5" min="3" max="10" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="red">Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-from">From Email Address</Label>
                      <Input id="email-from" type="email" defaultValue="noreply@au-gms.edu" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-name">From Name</Label>
                      <Input id="email-name" defaultValue="AU Grant Management System" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" defaultValue="smtp.africauni.edu" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input id="smtp-port" type="number" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-security">Security</Label>
                      <select id="smtp-security" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="tls">TLS</option>
                        <option value="ssl">SSL</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button className="mt-2" variant="outline" size="sm">
                    Test SMTP Connection
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">System Notifications</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Grant Submission Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Notify administrators about new grant submissions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Report Submission Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Notify grant officers about new report submissions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Deadline Reminders</p>
                      <p className="text-sm text-muted-foreground">
                        Send researchers reminders about upcoming deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System Status Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Notify administrators about system issues
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button variant="red">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
              <CardDescription>
                Manage connections to external systems and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Financial System</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to the university financial system
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="finapi-url">API Endpoint</Label>
                      <Input id="finapi-url" defaultValue="https://finance-api.africauni.edu" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="finapi-key">API Key</Label>
                      <Input id="finapi-key" type="password" value="••••••••••••••••" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Test Connection
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">User Directory</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to the university LDAP directory
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="ldap-server">LDAP Server</Label>
                      <Input id="ldap-server" defaultValue="ldap.africauni.edu" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="ldap-port">Port</Label>
                        <Input id="ldap-port" defaultValue="389" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="ldap-domain">Base DN</Label>
                        <Input id="ldap-domain" defaultValue="dc=africauni,dc=edu" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Test Connection
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Email Service</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to email notification service
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="email-provider">Email Provider</Label>
                      <select id="email-provider" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="smtp">SMTP Server</option>
                        <option value="sendgrid">SendGrid</option>
                        <option value="mailchimp">Mailchimp</option>
                      </select>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Configure
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 rounded-full p-2 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect to analytics services
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="analytics-service">Analytics Service</Label>
                      <select id="analytics-service" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option value="google">Google Analytics</option>
                        <option value="matomo">Matomo</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="analytics-id">Tracking ID</Label>
                      <Input id="analytics-id" defaultValue="UA-123456789-1" />
                    </div>
                    <Button variant="outline" size="sm" className="mt-2">
                      Verify
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button variant="red">Save Integration Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;
