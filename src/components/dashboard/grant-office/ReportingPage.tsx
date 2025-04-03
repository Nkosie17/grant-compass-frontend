
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart2, Download, FileText, Filter, Plus, PieChart } from "lucide-react";

const ReportingPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Grant Reporting</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="red" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="researchers">Researchers</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Grants
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">54</div>
                <p className="text-xs text-muted-foreground">
                  +12% from previous quarter
                </p>
                <div className="mt-4 h-[80px] w-full bg-[#cf2e2e]/5 rounded-md flex items-center justify-center">
                  [Bar Chart Placeholder]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Funding
                </CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  $720K awarded this quarter
                </p>
                <div className="mt-4 h-[80px] w-full bg-[#cf2e2e]/5 rounded-md flex items-center justify-center">
                  [Line Chart Placeholder]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Grant Success Rate
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from previous quarter
                </p>
                <div className="mt-4 h-[80px] w-full bg-[#cf2e2e]/5 rounded-md flex items-center justify-center">
                  [Pie Chart Placeholder]
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>
                  Latest reports submitted by researchers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4 bg-[#cf2e2e]/10 rounded-full p-2">
                        <FileText className="h-4 w-4 text-[#cf2e2e]" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {["Progress Report", "Financial Report", "Final Report"][Math.floor(Math.random() * 3)]} - {["Climate Research", "Agriculture Innovation", "Public Health Study"][Math.floor(Math.random() * 3)]}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>{["John Doe", "Jane Smith", "Robert Johnson"][Math.floor(Math.random() * 3)]}</span>
                          <span className="mx-2">•</span>
                          <span>{Math.floor(Math.random() * 5) + 1} days ago</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Funding by Department</CardTitle>
                <CardDescription>
                  Distribution of grants across departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] bg-[#cf2e2e]/5 rounded-md flex items-center justify-center mb-4">
                  [Bar Chart Placeholder]
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#cf2e2e] mr-2"></div>
                    <span>Sciences</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Engineering</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Humanities</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Other</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="researchers">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Researcher Activity</CardTitle>
                  <CardDescription>
                    Grant activity by researcher
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Researcher</div>
                  <div className="col-span-2">Department</div>
                  <div className="col-span-2">Active Grants</div>
                  <div className="col-span-2">Success Rate</div>
                  <div className="col-span-3">Total Funding</div>
                </div>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-3 font-medium">
                      {["John Doe", "Jane Smith", "Robert Johnson", "Emma Wilson", "David Lee", "Sarah Thompson", "Michael Brown"][i]}
                    </div>
                    <div className="col-span-2">
                      {["Computer Science", "Engineering", "Medicine", "Agriculture", "Physics", "Economics", "Chemistry"][i]}
                    </div>
                    <div className="col-span-2">
                      {Math.floor(Math.random() * 5) + 1}
                    </div>
                    <div className="col-span-2">
                      {Math.floor(Math.random() * 50) + 20}%
                    </div>
                    <div className="col-span-3">
                      ${(Math.floor(Math.random() * 500) + 50) * 1000}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grants">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Grant Analysis</CardTitle>
                  <CardDescription>
                    Performance metrics for all grants
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-[#cf2e2e]/5 rounded-md flex items-center justify-center mb-6">
                [Grant Performance Chart Placeholder]
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Internal Grants</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">$650K Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">External Grants</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">30</div>
                    <p className="text-xs text-muted-foreground">$1.75M Total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Completion Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">76%</div>
                    <p className="text-xs text-muted-foreground">+4% from last year</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">Avg. Duration</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">18 mo</div>
                    <p className="text-xs text-muted-foreground">-2 months from last year</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Grant Title</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Start Date</div>
                  <div className="col-span-3">Status</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-3 font-medium truncate pr-4">
                      {["Climate Change Adaptation", "Agricultural Technology", "Renewable Energy Solutions", "Public Health Interventions", "Educational Innovation"][i]} Research
                    </div>
                    <div className="col-span-2">
                      {["John Doe", "Jane Smith", "Robert Johnson", "Emma Wilson", "David Lee"][i]}
                    </div>
                    <div className="col-span-2">
                      ${(Math.floor(Math.random() * 200) + 50) * 1000}
                    </div>
                    <div className="col-span-2">
                      {["2023-01-15", "2023-03-22", "2023-05-10", "2023-07-05", "2023-09-18"][i]}
                    </div>
                    <div className="col-span-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        ["Active", "Completed", "Active", "Pending", "Active"][i] === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : ["Active", "Completed", "Active", "Pending", "Active"][i] === "Completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {["Active", "Completed", "Active", "Pending", "Active"][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Report Submissions</CardTitle>
                  <CardDescription>
                    Track and manage report submissions
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Report Title</div>
                  <div className="col-span-2">Researcher</div>
                  <div className="col-span-2">Grant ID</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-3 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#cf2e2e]" />
                      {["Q1 Progress Report", "Financial Update", "Mid-Year Report", "Project Milestone", "Annual Review", "Final Report"][i]}
                    </div>
                    <div className="col-span-2">
                      {["John Doe", "Jane Smith", "Robert Johnson", "Emma Wilson", "David Lee", "Sarah Thompson"][i]}
                    </div>
                    <div className="col-span-2">
                      AU-2023-{(Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0')}
                    </div>
                    <div className="col-span-2">
                      {Math.floor(Math.random() * 28) + 1} days ago
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        ["Pending Review", "Approved", "Needs Revision", "Pending Review", "Approved", "Pending Review"][i] === "Approved" 
                          ? "bg-green-100 text-green-800" 
                          : ["Pending Review", "Approved", "Needs Revision", "Pending Review", "Approved", "Pending Review"][i] === "Pending Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {["Pending Review", "Approved", "Needs Revision", "Pending Review", "Approved", "Pending Review"][i]}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportingPage;
