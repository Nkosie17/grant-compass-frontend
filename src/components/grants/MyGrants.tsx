
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";

interface Grant {
  id: string;
  title: string;
  description: string;
  amount: number;
  status: 'active' | 'completed' | 'rejected' | 'pending';
  startDate: string;
  endDate: string;
  nextReportDue?: string;
  fundingSource: string;
}

const MOCK_GRANTS: Grant[] = [
  {
    id: "grant-1",
    title: "Climate Change Impact on Agricultural Practices",
    description: "Research on sustainable farming techniques in response to climate change in Zimbabwe.",
    amount: 25000,
    status: 'active',
    startDate: "2023-09-01",
    endDate: "2024-08-31",
    nextReportDue: "2023-12-15",
    fundingSource: "African Development Bank"
  },
  {
    id: "grant-2",
    title: "Rural Education Technology Implementation",
    description: "Developing and implementing educational technology solutions for rural schools.",
    amount: 15000,
    status: 'active',
    startDate: "2023-07-15",
    endDate: "2024-07-14",
    nextReportDue: "2023-12-01",
    fundingSource: "AU Internal Research Fund"
  },
  {
    id: "grant-3",
    title: "Traditional Medicine Documentation",
    description: "Documenting and analyzing traditional medicinal practices in East Africa.",
    amount: 12000,
    status: 'completed',
    startDate: "2022-11-01",
    endDate: "2023-10-31",
    fundingSource: "World Health Organization"
  },
  {
    id: "grant-4",
    title: "Women Entrepreneurship Support Program",
    description: "Research on effective support mechanisms for women entrepreneurs in urban areas.",
    amount: 18000,
    status: 'rejected',
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    fundingSource: "UN Women"
  },
  {
    id: "grant-5",
    title: "Renewable Energy Implementation in Remote Communities",
    description: "Feasibility study for solar and wind energy solutions in off-grid rural communities.",
    amount: 30000,
    status: 'pending',
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    fundingSource: "Clean Energy Foundation"
  }
];

const MyGrants: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const { toast } = useToast();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };
  
  const filteredGrants = selectedTab === "all" 
    ? MOCK_GRANTS 
    : MOCK_GRANTS.filter(grant => grant.status === selectedTab);
  
  const getStatusBadge = (status: Grant['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 text-white">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-black">Pending</Badge>;
      default:
        return null;
    }
  };
  
  const handleSubmitReport = (grantId: string) => {
    toast({
      title: "Report submission initiated",
      description: `You're about to submit a report for grant ${grantId}`,
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="My Grants"
        subtitle="Manage and track your grant applications and active grants"
      />
      
      <div className="p-6 flex-1">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Grants</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {filteredGrants.length > 0 ? (
                filteredGrants.map((grant) => (
                  <Card key={grant.id} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{grant.title}</CardTitle>
                        {getStatusBadge(grant.status)}
                      </div>
                      <CardDescription className="mt-2">{grant.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
                          <div>
                            <p className="text-sm font-medium">Grant Amount</p>
                            <p className="text-lg font-semibold text-primary">
                              {formatCurrency(grant.amount)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-base">
                              {formatDateRange(grant.startDate, grant.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                          <div>
                            <p className="text-sm font-medium">Funding Source</p>
                            <p className="text-sm">{grant.fundingSource}</p>
                          </div>
                        </div>
                      </div>
                      
                      {grant.status === 'active' && grant.nextReportDue && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 flex items-center">
                          <Clock className="h-5 w-5 mr-2" />
                          <p className="text-sm">
                            Next report due: <span className="font-semibold">{new Date(grant.nextReportDue).toLocaleDateString()}</span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline">View Details</Button>
                      
                      {grant.status === 'active' && (
                        <Button onClick={() => handleSubmitReport(grant.id)}>
                          Submit Report
                        </Button>
                      )}
                      
                      {grant.status === 'rejected' && (
                        <Button variant="outline" className="text-primary">
                          View Feedback
                        </Button>
                      )}
                      
                      {grant.status === 'pending' && (
                        <Button variant="outline" disabled>
                          Awaiting Review
                        </Button>
                      )}
                      
                      {grant.status === 'completed' && (
                        <Button variant="outline">
                          View Final Report
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium text-lg mb-1">No Grants Found</h3>
                  <p className="text-muted-foreground">
                    You don't have any {selectedTab !== 'all' ? selectedTab : ''} grants yet.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/opportunities">Browse Opportunities</a>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyGrants;
