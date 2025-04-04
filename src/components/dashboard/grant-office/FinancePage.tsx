import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart2, Download, Filter, Plus, PieChart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FinancePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Financial Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="red" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="reports">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Active Funding
                </CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.4M</div>
                <p className="text-xs text-muted-foreground">
                  Across 54 active grants
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Year Budget
                </CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <p className="text-xs text-muted-foreground">
                  FY 2023-2024
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Budget Utilization
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  $816K of $1.2M utilized
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Payments
                </CardTitle>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Due in the next 30 days
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Allocation by Category</CardTitle>
                <CardDescription>
                  Breakdown of funding by expense categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-[#cf2e2e]/5 rounded-md flex items-center justify-center mb-4">
                  [Pie Chart Placeholder]
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-[#cf2e2e] mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Personnel</p>
                      <p className="text-xs text-muted-foreground">$520K (42%)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Equipment</p>
                      <p className="text-xs text-muted-foreground">$245K (20%)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Operations</p>
                      <p className="text-xs text-muted-foreground">$185K (15%)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Travel</p>
                      <p className="text-xs text-muted-foreground">$125K (10%)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Overhead</p>
                      <p className="text-xs text-muted-foreground">$98K (8%)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-gray-500 mr-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Other</p>
                      <p className="text-xs text-muted-foreground">$62K (5%)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Expenditure</CardTitle>
                <CardDescription>
                  Financial activity over the past 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-[#cf2e2e]/5 rounded-md flex items-center justify-center mb-4">
                  [Bar Chart Placeholder]
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border rounded-md p-2">
                    <p className="text-muted-foreground text-xs">Average</p>
                    <p className="font-medium">$68,500</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <p className="text-muted-foreground text-xs">Highest</p>
                    <p className="font-medium">$96,200</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <p className="text-muted-foreground text-xs">Trend</p>
                    <p className="font-medium text-green-600">+12%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Latest financial activities across all grants
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Grant ID</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-2 text-muted-foreground">
                      {new Date(Date.now() - (i * 86400000 * 2)).toISOString().split('T')[0]}
                    </div>
                    <div className="col-span-4 font-medium">
                      {[
                        "Laboratory equipment purchase",
                        "Research assistant salary",
                        "Conference registration fees",
                        "Field research expenses",
                        "Publication charges"
                      ][i]}
                    </div>
                    <div className="col-span-2">
                      AU-{2023}-{(Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0')}
                    </div>
                    <div className="col-span-2">
                      {["Equipment", "Personnel", "Travel", "Operations", "Overhead"][i]}
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      ${(Math.floor(Math.random() * 9000) + 1000).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Complete record of financial transactions
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
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Transaction ID</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-3">Description</div>
                  <div className="col-span-1">Grant ID</div>
                  <div className="col-span-1">Category</div>
                  <div className="col-span-1">Type</div>
                  <div className="col-span-1 text-right">Amount</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-2 font-mono text-xs">
                      TX-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                    </div>
                    <div className="col-span-2 text-muted-foreground">
                      {new Date(Date.now() - (i * 86400000 * 2)).toISOString().split('T')[0]}
                    </div>
                    <div className="col-span-3 font-medium truncate pr-2">
                      {[
                        "Laboratory equipment purchase",
                        "Research assistant salary",
                        "Conference registration fees",
                        "Field research expenses",
                        "Publication charges",
                        "Software licenses",
                        "Data collection services",
                        "Project management fees",
                        "Equipment maintenance",
                        "Research materials"
                      ][i]}
                    </div>
                    <div className="col-span-1">
                      AU-{(Math.floor(Math.random() * 900) + 100).toString().padStart(3, '0')}
                    </div>
                    <div className="col-span-1">
                      {["Equipment", "Personnel", "Travel", "Operations", "Overhead"][i % 5]}
                    </div>
                    <div className="col-span-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        i % 3 === 0 
                          ? "bg-green-100 text-green-800" 
                          : i % 3 === 1
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {i % 3 === 0 ? "Income" : i % 3 === 1 ? "Expense" : "Transfer"}
                      </span>
                    </div>
                    <div className="col-span-1 text-right font-medium">
                      {i % 3 === 0 ? "+" : i % 3 === 1 ? "-" : "±"}${(Math.floor(Math.random() * 9000) + 1000).toLocaleString()}
                    </div>
                    <div className="col-span-1 text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>128</strong> transactions
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
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Budget Management</CardTitle>
                  <CardDescription>
                    Monitor and manage grant budgets
                  </CardDescription>
                </div>
                <Button variant="red" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border mb-6">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-3">Grant</div>
                  <div className="col-span-2">Total Budget</div>
                  <div className="col-span-2">Spent</div>
                  <div className="col-span-2">Remaining</div>
                  <div className="col-span-2">Utilization</div>
                  <div className="col-span-1">Actions</div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-3 font-medium">
                      {[
                        "Climate Change Research Initiative",
                        "Agricultural Innovation Grant",
                        "Public Health Research Fund",
                        "Education Technology Development",
                        "Renewable Energy Solutions"
                      ][i]}
                    </div>
                    <div className="col-span-2">
                      ${(Math.floor(Math.random() * 15) + 5) * 10000}
                    </div>
                    <div className="col-span-2">
                      ${(Math.floor(Math.random() * 10) + 2) * 10000}
                    </div>
                    <div className="col-span-2">
                      ${(Math.floor(Math.random() * 5) + 1) * 10000}
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-[#cf2e2e] h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 30) + 60}%`}}></div>
                        </div>
                        <span>{Math.floor(Math.random() * 30) + 60}%</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">Budget Allocation by Department</h3>
                <div className="h-[300px] bg-[#cf2e2e]/5 rounded-md flex items-center justify-center mb-4">
                  [Department Budget Chart Placeholder]
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-md p-2">
                    <h4 className="text-xs text-muted-foreground mb-1">Computer Science</h4>
                    <p className="font-medium">$320,000</p>
                    <p className="text-xs text-muted-foreground mt-1">14 grants</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <h4 className="text-xs text-muted-foreground mb-1">Medicine</h4>
                    <p className="font-medium">$285,000</p>
                    <p className="text-xs text-muted-foreground mt-1">12 grants</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <h4 className="text-xs text-muted-foreground mb-1">Engineering</h4>
                    <p className="font-medium">$240,000</p>
                    <p className="text-xs text-muted-foreground mt-1">9 grants</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <h4 className="text-xs text-muted-foreground mb-1">Agriculture</h4>
                    <p className="font-medium">$195,000</p>
                    <p className="text-xs text-muted-foreground mt-1">8 grants</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>
                    Generate and download financial reports
                  </CardDescription>
                </div>
                <Button variant="red" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Quarterly Financial Summary</CardTitle>
                    <CardDescription>
                      Q3 2023 (July - September)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Total Income:</span>
                      <span className="font-medium">$482,500</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Total Expenses:</span>
                      <span className="font-medium">$347,200</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm border-t">
                      <span className="font-medium">Net Balance:</span>
                      <span className="font-medium text-green-600">$135,300</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Grant Utilization Report</CardTitle>
                    <CardDescription>
                      2023 Year-to-Date
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Total Grants:</span>
                      <span className="font-medium">54</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Total Budget:</span>
                      <span className="font-medium">$1.2M</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm border-t">
                      <span className="font-medium">Utilization Rate:</span>
                      <span className="font-medium text-amber-600">68%</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Department Funding Report</CardTitle>
                    <CardDescription>
                      Financial Year 2023-2024
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Departments:</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm">
                      <span className="text-muted-foreground">Top Department:</span>
                      <span className="font-medium">Computer Science</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-sm border-t">
                      <span className="font-medium">Funding Range:</span>
                      <span className="font-medium">$65K - $320K</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Custom Report Generator</CardTitle>
                  <CardDescription>
                    Create customized financial reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label>Report Type</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>Financial Summary</option>
                        <option>Expenditure Report</option>
                        <option>Budget Analysis</option>
                        <option>Grant Utilization</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>Current Quarter</option>
                        <option>Previous Quarter</option>
                        <option>Year to Date</option>
                        <option>Last 12 Months</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>All Departments</option>
                        <option>Computer Science</option>
                        <option>Medicine</option>
                        <option>Engineering</option>
                        <option>Agriculture</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Format</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                        <option>PDF</option>
                        <option>Excel</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="red">
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancePage;
