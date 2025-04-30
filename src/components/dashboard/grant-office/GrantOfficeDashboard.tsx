
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grant, GrantStatus, GrantCategory, FundingSource } from "@/types/grants";
import DashboardHeader from "../DashboardHeader";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function GrantOfficeDashboard() {
  const [grants, setGrants] = useState<Grant[]>([]);

  const { data: grantsData, isLoading, error } = useQuery({
    queryKey: ["grants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grants")
        .select("*");

      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (grantsData) {
      // Convert the data from Supabase to match our Grant interface
      const convertedGrants: Grant[] = grantsData.map(grant => ({
        id: grant.id,
        title: grant.title,
        description: grant.description,
        amount: grant.amount,
        startDate: grant.start_date,
        endDate: grant.end_date,
        status: grant.status as GrantStatus,
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
        // Map the additional fields with safe access
        activities: grant.activities || null,
        budget: grant.budget || null,
        studentParticipation: grant.student_participation || null,
        workPlan: grant.work_plan || null
      }));
      
      setGrants(convertedGrants);
    }
  }, [grantsData]);

  // Calculate statistics
  const pendingApproval = grants.filter(g => g.status === "submitted" || g.status === "under_review").length;
  const totalGrants = grants.length;
  const totalAmount = grants.reduce((sum, grant) => sum + grant.amount, 0);

  // Data for charts
  const statusData = [
    { name: "Draft", count: grants.filter(g => g.status === "draft").length },
    { name: "Submitted", count: grants.filter(g => g.status === "submitted").length },
    { name: "Under Review", count: grants.filter(g => g.status === "under_review").length },
    { name: "Approved", count: grants.filter(g => g.status === "approved").length },
    { name: "Rejected", count: grants.filter(g => g.status === "rejected").length },
    { name: "Modifications", count: grants.filter(g => g.status === "modifications_requested").length },
  ];

  const categoryData = [
    { name: "Research", count: grants.filter(g => g.category === "research").length },
    { name: "Education", count: grants.filter(g => g.category === "education").length },
    { name: "Community", count: grants.filter(g => g.category === "community").length },
    { name: "Infrastructure", count: grants.filter(g => g.category === "infrastructure").length },
    { name: "Innovation", count: grants.filter(g => g.category === "innovation").length },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading dashboard: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader title="Grant Office Dashboard" />

      <div className="flex justify-between mb-6">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
        <Link to="/create-opportunity">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Opportunity
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApproval}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Grants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGrants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Funding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Grant Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Number of Grants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Grant Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" name="Number of Grants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Grant Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Researcher</th>
                    <th className="text-left py-3 px-4">Department</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {grants.slice(0, 5).map((grant) => (
                    <tr key={grant.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <Link to={`/grant-review/${grant.id}`} className="text-blue-600 hover:underline">
                          {grant.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{grant.researcherName}</td>
                      <td className="py-3 px-4">{grant.department}</td>
                      <td className="py-3 px-4">${grant.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(grant.status)}`}>
                          {formatStatus(grant.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {grants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-muted-foreground">
                        No grant applications found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {grants.length > 5 && (
              <div className="flex justify-center mt-4">
                <Link to="/applications">
                  <Button variant="outline">View All Applications</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getStatusColor(status: GrantStatus): string {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "submitted":
      return "bg-blue-100 text-blue-800";
    case "under_review":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "modifications_requested":
      return "bg-orange-100 text-orange-800";
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "completed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function formatStatus(status: GrantStatus): string {
  return status.split("_").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
}
