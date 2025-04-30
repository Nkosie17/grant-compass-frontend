
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Grant, GrantStatus, GrantCategory, FundingSource } from "@/types/grants";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function GrantReviewForm() {
  const { grantId } = useParams<{ grantId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [reviewComments, setReviewComments] = useState<string>("");
  const [status, setStatus] = useState<GrantStatus>("under_review");

  const { data: grant, isLoading, error } = useQuery({
    queryKey: ["grant", grantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("grants")
        .select("*")
        .eq("id", grantId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (grant) {
      setStatus(grant.status as GrantStatus);
      setReviewComments(grant.review_comments || "");
    }
  }, [grant]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to review grants.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("grants")
        .update({
          status: status,
          review_comments: reviewComments,
          reviewed_by: user.id,
          reviewed_date: new Date().toISOString()
        })
        .eq("id", grantId);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "The grant has been successfully reviewed.",
      });

      navigate("/applications");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit the review. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting review:", error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading grant details...</div>;
  }

  if (error || !grant) {
    return <div className="text-red-500 p-4">Error loading grant: {(error as Error)?.message || "Grant not found"}</div>;
  }

  // Properly convert the data to match our Grant interface
  const grantData: Grant = {
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
    reviewedDate: grant.reviewed_date
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Grant Review: {grantData.title}</h1>
        <p className="text-muted-foreground">
          Submitted by {grantData.researcherName} on {new Date(grantData.submittedDate || "").toLocaleDateString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Grant Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="mt-1">{grantData.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-medium">Amount</h3>
                    <p className="mt-1">${grantData.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p className="mt-1">{grantData.category}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Funding Source</h3>
                    <p className="mt-1">{grantData.fundingSource}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Start Date</h3>
                    <p className="mt-1">{new Date(grantData.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">End Date</h3>
                    <p className="mt-1">{new Date(grantData.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">Department</h3>
                  <p className="mt-1">{grantData.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Submit Review</CardTitle>
              <CardDescription>Provide feedback and update the status of this grant application</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={(value) => setStatus(value as GrantStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="modifications_requested">Modifications Requested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comments">Review Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Enter your feedback or comments"
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
