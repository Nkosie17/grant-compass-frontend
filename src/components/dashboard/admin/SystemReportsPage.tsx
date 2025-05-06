
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const systemData = [
  { month: "Jan", applications: 24, approved: 18, rejected: 6 },
  { month: "Feb", applications: 32, approved: 22, rejected: 10 },
  { month: "Mar", applications: 28, approved: 20, rejected: 8 },
  { month: "Apr", applications: 35, approved: 27, rejected: 8 },
  { month: "May", applications: 42, approved: 30, rejected: 12 },
  { month: "Jun", applications: 38, approved: 25, rejected: 13 },
];

const usageData = [
  { name: "Research", value: 42 },
  { name: "Education", value: 28 },
  { name: "Community", value: 15 },
  { name: "Infrastructure", value: 10 },
  { name: "Innovation", value: 5 },
];

const SystemReportsPage = () => {
  const downloadReport = (reportType: string) => {
    // This would be implemented to generate and download a report in a real application
    // For now, we'll just show a toast or alert
    alert(`Downloading ${reportType} report...`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Reports</h1>
          <p className="text-muted-foreground">
            Overview of system performance and usage
          </p>
        </div>
        <Button onClick={() => downloadReport("System")} className="gap-2">
          <Download className="h-4 w-4" />
          Download Full Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Application Stats Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Grant Applications</CardTitle>
            <CardDescription>Summary of grant application statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Applications</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">199</span>
                  <span className="text-sm text-emerald-500 flex items-center">
                    <ArrowUp className="h-3 w-3" />
                    12%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Approval Rate</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">71%</span>
                  <span className="text-sm text-emerald-500 flex items-center">
                    <ArrowUp className="h-3 w-3" />
                    5%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Avg. Processing Time</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">4.2 days</span>
                  <span className="text-sm text-emerald-500 flex items-center">
                    <ArrowDown className="h-3 w-3" />
                    0.8
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Grant Funding Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Grant Funding</CardTitle>
            <CardDescription>Summary of allocated funding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Allocated</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$2.4M</span>
                  <span className="text-sm text-emerald-500 flex items-center">
                    <ArrowUp className="h-3 w-3" />
                    18%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Avg. Grant Size</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$16.8K</span>
                  <span className="text-sm text-emerald-500 flex items-center">
                    <ArrowUp className="h-3 w-3" />
                    3%
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Available Funds</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">$1.1M</span>
                  <span className="text-sm text-destructive flex items-center">
                    <ArrowDown className="h-3 w-3" />
                    22%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Application Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Grant Application Trends</CardTitle>
            <CardDescription>Monthly application, approval, and rejection rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={systemData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="applications" fill="#6366f1" name="Applications" />
                  <Bar dataKey="approved" fill="#10b981" name="Approved" />
                  <Bar dataKey="rejected" fill="#f43f5e" name="Rejected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grant Usage by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Grant Usage by Category</CardTitle>
            <CardDescription>Distribution of grants across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Health</CardTitle>
            <CardDescription>Overall system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Server Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Database Performance</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">120ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "90%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Storage Usage</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemReportsPage;
