
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Grant, GrantStatus, GrantCategory, FundingSource } from "@/types/grants";

const statusColors: Record<GrantStatus, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  under_review: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  modifications_requested: "bg-orange-50 text-orange-700 border-orange-200",
  active: "bg-violet-50 text-violet-700 border-violet-200",
  completed: "bg-teal-50 text-teal-700 border-teal-200"
};

// Format number safely
const safeFormatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return "$0";
  }
  return `$${value.toLocaleString()}`;
};

// Format date safely
const safeFormatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const GrantReviewForm = () => {
  const { grantId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [grant, setGrant] = useState<Grant | null>(null);
  const [reviewComments, setReviewComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGrant = async () => {
      try {
        // In a real app, this would be an API call
        const storedGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");
        const foundGrant = storedGrants.find((g: any) => g.id === grantId);
        
        if (foundGrant) {
          // Make sure we convert string values to the appropriate enum types
          const typedGrant: Grant = {
            ...foundGrant,
            status: foundGrant.status as GrantStatus,
            category: foundGrant.category as GrantCategory,
            fundingSource: foundGrant.fundingSource as FundingSource,
          };
          
          setGrant(typedGrant);
          setReviewComments(typedGrant.reviewComments || "");
        } else {
          toast.error("Grant application not found");
          navigate("/applications");
        }
      } catch (error) {
        console.error("Error fetching grant:", error);
        toast.error("Error loading grant application data");
      }
    };

    if (grantId) {
      fetchGrant();
    }
  }, [grantId, navigate]);

  const handleApprove = async () => {
    handleUpdateStatus("approved");
  };

  const handleReject = async () => {
    handleUpdateStatus("rejected");
  };

  const handleRequestModifications = async () => {
    handleUpdateStatus("modifications_requested");
  };

  const handleUpdateStatus = async (status: GrantStatus) => {
    if (!grant) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const storedGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");
      const updatedGrants = storedGrants.map((g: any) => {
        if (g.id === grantId) {
          return {
            ...g,
            status: status,
            reviewComments: reviewComments,
            reviewedBy: user?.id,
            reviewedDate: new Date().toISOString()
          };
        }
        return g;
      });
      
      localStorage.setItem("au_gms_grants", JSON.stringify(updatedGrants));
      
      // Create a notification for the researcher
      if (grant.researcherId) {
        const statusMessage = status === "approved" 
          ? "Your grant application has been approved!" 
          : status === "rejected" 
            ? "Your grant application has been rejected." 
            : "Your grant application requires modifications.";
            
        const notificationType = status === "approved" 
          ? "grant_approval" 
          : status === "rejected" 
            ? "grant_rejection" 
            : "grant_modifications";
            
        // Get existing notifications or initialize empty array
        const notifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
        
        // Create new notification
        const notification = {
          id: `notif_${Date.now()}`,
          userId: grant.researcherId,
          message: statusMessage,
          type: notificationType,
          isRead: false,
          createdAt: new Date().toISOString(),
          relatedId: grant.id,
          relatedType: "grant"
        };
        
        // Add notification and save back to localStorage
        notifications.push(notification);
        localStorage.setItem("au_gms_notifications", JSON.stringify(notifications));
      }
      
      toast.success(`Grant application ${status.replace(/_/g, " ")}`);
      navigate("/applications");
    } catch (error) {
      console.error("Error updating grant:", error);
      toast.error("Error updating grant application status");
    } finally {
      setIsLoading(false);
    }
  };

  if (!grant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/applications")}
          className="mb-4"
        >
          ← Back to Applications
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{grant.title}</h1>
          <Badge 
            variant="outline" 
            className={statusColors[grant.status]}
          >
            {grant.status.replace(/_/g, " ").toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Submitted on {safeFormatDate(grant.submittedDate)} • Reference #{grant.id.substring(0, 8)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Grant Details</TabsTrigger>
              <TabsTrigger value="researcher">Researcher</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grant Information</CardTitle>
                  <CardDescription>Details about the grant application</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm mt-1">{grant.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Category</h3>
                      <p className="text-sm mt-1 capitalize">{grant.category.replace(/_/g, " ")}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Funding Source</h3>
                      <p className="text-sm mt-1 capitalize">{grant.fundingSource.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Amount Requested</h3>
                      <p className="text-sm mt-1 font-semibold">{safeFormatNumber(grant.amount)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Department</h3>
                      <p className="text-sm mt-1">{grant.department || "Not specified"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Start Date</h3>
                      <p className="text-sm mt-1">{safeFormatDate(grant.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">End Date</h3>
                      <p className="text-sm mt-1">{safeFormatDate(grant.endDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {grant.activities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Planned Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{grant.activities}</p>
                  </CardContent>
                </Card>
              )}
              
              {grant.budget && (
                <Card>
                  <CardHeader>
                    <CardTitle>Budget</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{grant.budget}</p>
                  </CardContent>
                </Card>
              )}
              
              {grant.studentParticipation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Student Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{grant.studentParticipation}</p>
                  </CardContent>
                </Card>
              )}
              
              {grant.workPlan && (
                <Card>
                  <CardHeader>
                    <CardTitle>Work Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-line">{grant.workPlan}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="researcher">
              <Card>
                <CardHeader>
                  <CardTitle>Researcher Information</CardTitle>
                  <CardDescription>Details about the grant applicant</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {grant.researcherName ? grant.researcherName.charAt(0) : "R"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{grant.researcherName || "Unknown Researcher"}</h3>
                      <p className="text-sm text-muted-foreground">{grant.department || "No Department"}</p>
                    </div>
                  </div>
                  
                  {/* Additional researcher information would go here in a real app */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review Grant Application</CardTitle>
                  <CardDescription>Provide feedback and make a decision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Review Comments</h3>
                    <Textarea 
                      placeholder="Enter your review comments here..."
                      className="min-h-32"
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <Button 
                      onClick={handleApprove} 
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Approve Grant
                    </Button>
                    <Button 
                      onClick={handleRequestModifications}
                      variant="outline" 
                      disabled={isLoading}
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      Request Modifications
                    </Button>
                    <Button 
                      onClick={handleReject}
                      variant="outline" 
                      disabled={isLoading}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-muted-foreground">{safeFormatDate(grant.submittedDate)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {grant.researcherName || "Unknown"}
                    </p>
                  </div>
                </div>
                
                {grant.reviewedDate && (
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        grant.status === "approved" ? "bg-green-500" : 
                        grant.status === "rejected" ? "bg-red-500" : "bg-orange-500"
                      }`} />
                      <div className="h-full w-px bg-border" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {grant.status === "approved" ? "Approved" : 
                         grant.status === "rejected" ? "Rejected" : 
                         "Modifications Requested"}
                      </p>
                      <p className="text-sm text-muted-foreground">{safeFormatDate(grant.reviewedDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrantReviewForm;
