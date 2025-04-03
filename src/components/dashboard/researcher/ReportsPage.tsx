
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter, Plus } from "lucide-react";

const ReportsPage: React.FC = () => {
  const reports = [
    {
      id: 1,
      title: "Climate Change Adaptation Research Progress",
      grantId: "AU-2023-001",
      type: "Progress",
      submittedDate: "2023-11-15",
      status: "Approved",
    },
    {
      id: 2,
      title: "Renewable Energy Solutions for Rural Areas",
      grantId: "AU-2023-005",
      type: "Financial",
      submittedDate: "2023-10-22",
      status: "Pending Review",
    },
    {
      id: 3,
      title: "Agricultural Technology Impact Assessment",
      grantId: "AU-2022-015",
      type: "Final",
      submittedDate: "2023-09-05",
      status: "Needs Revision",
    },
    {
      id: 4,
      title: "Public Health Intervention Study Quarterly Update",
      grantId: "AU-2023-008",
      type: "Progress",
      submittedDate: "2023-12-01",
      status: "Pending Review",
    },
  ];

  const templates = [
    {
      id: 1,
      title: "Quarterly Progress Report",
      description: "Standard template for quarterly updates on research progress",
      lastUpdated: "2023-09-15",
    },
    {
      id: 2,
      title: "Financial Expenditure Report",
      description: "Template for reporting financial expenditures and budget usage",
      lastUpdated: "2023-10-20",
    },
    {
      id: 3,
      title: "Final Project Report",
      description: "Comprehensive template for final project outcomes and impact",
      lastUpdated: "2023-11-05",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button variant="red" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Report
        </Button>
      </div>

      <Tabs defaultValue="my-reports" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>My Submitted Reports</CardTitle>
                  <CardDescription>
                    View and manage reports you've submitted
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-12 bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-4">Title</div>
                  <div className="col-span-2">Grant ID</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                </div>
                {reports.map((report) => (
                  <div 
                    key={report.id}
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors"
                  >
                    <div className="col-span-4 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#cf2e2e]" />
                      {report.title}
                    </div>
                    <div className="col-span-2">{report.grantId}</div>
                    <div className="col-span-2">{report.type}</div>
                    <div className="col-span-2">{report.submittedDate}</div>
                    <div className="col-span-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        report.status === "Approved" 
                          ? "bg-green-100 text-green-800" 
                          : report.status === "Pending Review"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Standard templates for different types of reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:border-[#cf2e2e]/30 hover:bg-[#cf2e2e]/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <h3 className="font-medium">{template.title}</h3>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">Last updated: {template.lastUpdated}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-1">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">Use Template</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Reports scheduled for future submission
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-center items-center h-48 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No scheduled reports</h3>
                <p className="text-sm max-w-md">
                  You don't have any reports scheduled for submission at this time.
                </p>
                <Button variant="outline" className="mt-4">
                  Schedule a Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
