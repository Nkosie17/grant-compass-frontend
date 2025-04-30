import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { Grant } from "@/types/grants";

const GrantOfficeDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingApplications, setPendingApplications] = useState<Grant[]>([]);
  const [approvedApplications, setPendingApproved] = useState<Grant[]>([]);
  const [totalActiveFunding, setTotalActiveFunding] = useState<number>(0);
  const [needsAttention, setNeedsAttention] = useState<Grant[]>([]);
  
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        setLoading(true);
        
        // Fetch grants from Supabase
        const { data: grantsData, error } = await supabase
          .from('grants')
          .select('*')
          .order('submitted_date', { ascending: false });
          
        if (error) throw error;
        
        if (grantsData) {
          // Transform the data to match the Grant type
          const grants: Grant[] = grantsData.map(grant => ({
            id: grant.id,
            title: grant.title,
            description: grant.description,
            amount: grant.amount,
            startDate: grant.start_date,
            endDate: grant.end_date,
            status: grant.status,
            category: grant.category,
            fundingSource: grant.funding_source,
            submittedBy: grant.submitted_by,
            submittedDate: grant.submitted_date,
            researcherId: grant.researcher_id,
            researcherName: grant.researcher_name,
            department: grant.department,
            reviewComments: grant.review_comments,
            reviewedBy: grant.reviewed_by,
            reviewedDate: grant.reviewed_date,
          }));

          // Filter pending applications
          const pending = grants.filter(grant => 
            grant.status === "submitted" || grant.status === "under_review"
          );
          setPendingApplications(pending);
          
          // Filter approved applications
          const approved = grants.filter(grant => 
            grant.status === "approved" || grant.status === "active"
          );
          setPendingApproved(approved);
          
          // Calculate total active funding
          const activeFunding = grants
            .filter(grant => grant.status === "active")
            .reduce((total, grant) => total + (grant.amount || 0), 0);
            
          setTotalActiveFunding(activeFunding);
          
          // Filter needs attention
          const attention = grants.filter(grant => 
            grant.status === "modifications_requested"
          );
          setNeedsAttention(attention);
        }
      } catch (error) {
        console.error("Error fetching grants:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrants();
  }, []);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "submitted":
      case "under_review":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "modifications_requested":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-orange-100 text-orange-800";
      case "modifications_requested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader 
        title="Grant Office Dashboard"
        subtitle="Monitor and manage grant applications"
      />
      
      <div className="p-6 flex-1">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {
                  approvedApplications.filter(grant => 
                    new Date(grant.submittedDate || "").getMonth() === new Date().getMonth()
                  ).length
                }
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Active Funding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalActiveFunding)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{needsAttention.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Applications</TabsTrigger>
            <TabsTrigger value="recent">Recent Approvals</TabsTrigger>
            <TabsTrigger value="attention">Needs Attention</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Review and process submitted applications</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApplications.length > 0 ? (
                  <div className="space-y-4">
                    {pendingApplications.map((grant) => (
                      <div
                        key={grant.id}
                        className="border rounded-lg p-4 hover:bg-au-neutral-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {getStatusIcon(grant.status)}
                            <h3 className="font-medium ml-2">{grant.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grant.status)}`}>
                            {grant.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {grant.description.length > 100
                            ? `${grant.description.substring(0, 100)}...`
                            : grant.description}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(grant.amount)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Submitted by: {grant.submittedBy} on {grant.submittedDate}
                            </span>
                          </div>
                          <Button asChild size="sm">
                            <Link to={`/applications/${grant.id}`}>Review</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    There are no pending applications at this time.
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant="outline">
                  <Link to="/applications">View All Applications</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>Recently approved grant applications</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedApplications.length > 0 ? (
                  <div className="space-y-4">
                    {approvedApplications.map((grant) => (
                      <div
                        key={grant.id}
                        className="border rounded-lg p-4 hover:bg-au-neutral-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            {getStatusIcon(grant.status)}
                            <h3 className="font-medium ml-2">{grant.title}</h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grant.status)}`}>
                            {grant.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(grant.amount)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {grant.startDate} - {grant.endDate}
                            </span>
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/applications/${grant.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    There are no recently approved applications.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attention">
            <Card>
              <CardHeader>
                <CardTitle>Needs Attention</CardTitle>
                <CardDescription>Applications that require modifications or special attention</CardDescription>
              </CardHeader>
              <CardContent>
                {needsAttention.length > 0 ? (
                  <div className="space-y-4">
                    {needsAttention.map((grant) => (
                      <div
                        key={grant.id}
                        className="border border-red-200 rounded-lg p-4 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h3 className="font-medium ml-2">{grant.title}</h3>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            Modifications Requested
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                          Budget issues need to be addressed before approval can proceed.
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">{formatCurrency(grant.amount)}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              Submitted by: {grant.submittedBy}
                            </span>
                          </div>
                          <Button asChild size="sm" className="bg-red-500 hover:bg-red-600">
                            <Link to={`/applications/${grant.id}`}>Review Issues</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    There are no applications needing attention at this time.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Overview of grant funding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <div className="flex flex-col items-center text-muted-foreground">
                <BarChart2 className="h-10 w-10 mb-2" />
                <p>Financial reports and charts will be displayed here</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/finance">View Financial Reports</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default GrantOfficeDashboard;
