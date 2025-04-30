import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart2, CheckCircle, Clock, FileText, AlertCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { supabase } from "@/integrations/supabase/client";
import { Grant, GrantStatus, GrantCategory, FundingSource } from "@/types/grants";

const GrantOfficeDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingApplications, setPendingApplications] = useState<Grant[]>([]);
  const [totalGrants, setTotalGrants] = useState<number>(0);
  const [approvedGrants, setApprovedGrants] = useState<number>(0);
  const [rejectedGrants, setRejectedGrants] = useState<number>(0);

  useEffect(() => {
    const fetchGrantsData = async () => {
      try {
        // Fetch grants data from Supabase
        const { data: grantsData, error } = await supabase
          .from('grants')
          .select('*')
          .order('submitted_date', { ascending: false });

        if (error) {
          throw error;
        }

        // If no grants data is found, use an empty array
        const grants = grantsData || [];
        
        // Transform Supabase data to Grant interface format
        const transformedGrants: Grant[] = grants.map(grant => ({
          id: grant.id,
          title: grant.title,
          description: grant.description,
          amount: grant.amount,
          startDate: grant.start_date,
          endDate: grant.end_date,
          status: grant.status as GrantStatus, // Explicit type casting
          category: grant.category as GrantCategory,
          fundingSource: grant.funding_source as FundingSource,
          submittedBy: grant.submitted_by,
          submittedDate: grant.submitted_date,
          researcherId: grant.researcher_id,
          researcherName: grant.researcher_name,
          department: grant.department,
          reviewComments: grant.review_comments,
          reviewedBy: grant.reviewed_by,
          reviewedDate: grant.reviewed_date,
          // Handle optional properties that might not exist in the database
          activities: grant.activities || undefined,
          budget: grant.budget || undefined,
          studentParticipation: grant.student_participation || undefined,
          workPlan: grant.work_plan || undefined
        }));

        // Filter pending applications
        const pending = transformedGrants.filter(grant => 
          grant.status === 'submitted' || grant.status === 'under_review'
        );
        
        // Set state with fetched data
        setPendingApplications(pending);
        setTotalGrants(transformedGrants.length);
        setApprovedGrants(transformedGrants.filter(g => g.status === 'approved' || g.status === 'active').length);
        setRejectedGrants(transformedGrants.filter(g => g.status === 'rejected').length);
        
      } catch (error) {
        console.error('Error fetching grants data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrantsData();
  }, []);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6">
      <DashboardHeader heading="Grant Office Dashboard" text="Monitor and manage grant applications, approvals, and overall statistics." />

      {loading ? (
        <div className="flex items-center justify-center min-h-48">
          <Clock className="mr-2 h-4 w-4 animate-spin" /> Loading data...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Total Applications</CardTitle>
              <CardDescription>All grant applications received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGrants}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              <Link to="/applications">View all applications</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Pending Review</CardTitle>
              <CardDescription>Applications awaiting review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingApplications.length}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <Link to="/applications">Review applications</Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Approved Grants</CardTitle>
              <CardDescription>Grants that have been approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{approvedGrants}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <CheckCircle className="mr-2 h-4 w-4" />
              Manage approved grants
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Rejected Grants</CardTitle>
              <CardDescription>Grants that have been rejected</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rejectedGrants}</div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4" />
              View rejected grants
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Grant Applications</h2>
        {loading ? (
          <div className="flex items-center justify-center min-h-48">
            <Clock className="mr-2 h-4 w-4 animate-spin" /> Loading applications...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingApplications.map(grant => (
              <Card key={grant.id}>
                <CardHeader>
                  <CardTitle>{grant.title}</CardTitle>
                  <CardDescription>
                    Submitted by {grant.researcherName || 'Unknown'} from {grant.department || 'Unknown Department'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{grant.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary">{grant.category}</Badge>
                    <Badge variant="outline" className="ml-2">{grant.fundingSource}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Amount Requested: {formatCurrency(grant.amount)}
                  </div>
                  <Button asChild>
                    <Link to={`/grant-review/${grant.id}`}>Review Application</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {pendingApplications.length === 0 && (
              <div className="text-center py-4">
                No pending grant applications to review.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantOfficeDashboard;
