
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter, Plus } from "lucide-react";
import ReportDetails from "./ReportDetails";

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [reportDetailsOpen, setReportDetailsOpen] = useState(false);

  const reports = [
    {
      id: 1,
      title: "Climate Change Adaptation Research Progress",
      grantId: "AU-2023-001",
      type: "Progress",
      submittedDate: "2023-11-15",
      status: "Approved",
      content: "In this quarterly report, we outline the progress made on our climate change adaptation research. We have conducted surveys in 5 communities, collected environmental data from 12 sites, and completed preliminary analysis on adaptation strategies currently in use by local populations. Initial findings suggest that community-led initiatives have been more successful than top-down policy implementations.",
      feedback: "Excellent progress. The methodology is sound and the preliminary results are promising. Continue with the community engagement approach as planned."
    },
    {
      id: 2,
      title: "Renewable Energy Solutions for Rural Areas",
      grantId: "AU-2023-005",
      type: "Financial",
      submittedDate: "2023-10-22",
      status: "Pending Review",
      content: "This financial report covers the expenditures from July through September 2023. We have utilized 35% of the allocated budget, primarily for equipment purchases and field research. Notable expenditures include solar panel testing kits ($12,500) and community workshop materials ($5,200).",
    },
    {
      id: 3,
      title: "Agricultural Technology Impact Assessment",
      grantId: "AU-2022-015",
      type: "Final",
      submittedDate: "2023-09-05",
      status: "Needs Revision",
      content: "Final report on the impact assessment of introduced agricultural technologies in target communities. The 18-month project examined adoption rates, yield improvements, and economic impacts of three new farming technologies.",
      feedback: "Please expand the methodology section to include more details on control groups. The economic impact analysis needs more quantitative support and comparative data from similar regions."
    },
    {
      id: 4,
      title: "Public Health Intervention Study Quarterly Update",
      grantId: "AU-2023-008",
      type: "Progress",
      submittedDate: "2023-12-01",
      status: "Pending Review",
      content: "This quarterly update covers our progress on the public health intervention study in urban areas. We have completed the first phase of data collection, including health surveys from 350 participants and environmental health assessments of 20 locations."
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

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setReportDetailsOpen(true);
  };

  const closeReportDetails = () => {
    setReportDetailsOpen(false);
  };

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
                    className="grid grid-cols-12 p-3 text-sm border-t hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewReport(report)}
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

      {/* Report Details Dialog */}
      <ReportDetails 
        report={selectedReport} 
        isOpen={reportDetailsOpen} 
        onClose={closeReportDetails} 
      />
    </div>
  );
};

export default ReportsPage;
