
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Grant, GrantStatus } from "@/types/grants";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const reviewFormSchema = z.object({
  status: z.enum(["approved", "rejected", "modifications_requested"] as const),
  reviewComments: z.string().min(10, "Review comments must be at least 10 characters"),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

const GrantReviewForm: React.FC = () => {
  const { grantId } = useParams<{ grantId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [grant, setGrant] = useState<Grant | null>(null);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      status: "approved",
      reviewComments: "",
    },
  });

  // Add safe formatter functions to handle potentially undefined values
  const safeFormatNumber = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return "$0";
    }
    return `$${value.toLocaleString()}`;
  };

  // Format date safely
  const safeFormatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const fetchGrant = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call to fetch the grant by ID
        const storedGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");
        const foundGrant = storedGrants.find((g: Grant) => g.id === grantId);
        
        if (!foundGrant) {
          toast.error("Grant application not found");
          navigate("/applications");
          return;
        }
        
        setGrant(foundGrant);
      } catch (error) {
        console.error("Error fetching grant:", error);
        toast.error("Failed to load grant application");
      } finally {
        setIsLoading(false);
      }
    };

    if (grantId) {
      fetchGrant();
    }
  }, [grantId, navigate]);

  const onSubmit = async (data: ReviewFormValues) => {
    if (!grant) return;
    
    try {
      // Update the grant status and review information
      const updatedGrant = {
        ...grant,
        status: data.status as GrantStatus,
        reviewComments: data.reviewComments,
        reviewedBy: user?.id,
        reviewedDate: new Date().toISOString(),
      };

      // In a real app, this would be an API call to update the grant
      console.log("Updating grant:", updatedGrant);

      // Simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update in localStorage for demo purposes
      const storedGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");
      const updatedGrants = storedGrants.map((g: Grant) => 
        g.id === updatedGrant.id ? updatedGrant : g
      );
      localStorage.setItem("au_gms_grants", JSON.stringify(updatedGrants));

      // Create a notification for the researcher
      const notification = {
        id: `notification_${Date.now().toString()}`,
        userId: grant.researcherId,
        message: `Your grant application "${grant.title}" has been ${data.status.replace(/_/g, " ")}`,
        type: "status_update" as const,
        relatedId: grant.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      // Store notification in localStorage
      const storedNotifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
      localStorage.setItem(
        "au_gms_notifications", 
        JSON.stringify([...storedNotifications, notification])
      );

      toast.success("Review submitted successfully");
      navigate("/applications");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-au-purple" />
      </div>
    );
  }

  if (!grant) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Grant application not found. It may have been deleted or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/applications")}>
            Return to Applications
          </Button>
        </div>
      </div>
    );
  }

  const statusBadgeClass = () => {
    switch (grant.status) {
      case 'submitted': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'under_review': return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Review Grant Application</CardTitle>
              <CardDescription>Review and respond to this grant application</CardDescription>
            </div>
            <Badge variant="outline" className={statusBadgeClass()}>
              {grant.status.replace(/_/g, " ").split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Applicant Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Name:</span>
                  <p>{grant.researcherName || "Unknown"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Department:</span>
                  <p>{grant.department || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Submitted:</span>
                  <p>{safeFormatDate(grant.submittedDate)}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Grant Information</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Amount Requested:</span>
                  <p>{safeFormatNumber(grant.amount)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Category:</span>
                  <p>{grant.category ? (grant.category.charAt(0).toUpperCase() + grant.category.slice(1)) : "Not specified"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Funding Source:</span>
                  <p>{grant.fundingSource === "internal" ? "Internal" : "External"}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                  <p>{safeFormatDate(grant.startDate)} - {safeFormatDate(grant.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Project Details</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Title:</span>
                <p className="text-lg font-medium">{grant.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Description:</span>
                <p className="mt-1 whitespace-pre-wrap">{grant.description}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Review Decision</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Decision</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select decision" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="approved">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Approve
                            </div>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <div className="flex items-center">
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              Reject
                            </div>
                          </SelectItem>
                          <SelectItem value="modifications_requested">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                              Request Modifications
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {field.value === "approved" 
                          ? "Approve this grant application and allocate the requested funds."
                          : field.value === "rejected" 
                          ? "Reject this application. The applicant will be notified."
                          : "Request modifications before making a final decision."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reviewComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Comments</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide detailed feedback on this application"
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your comments will be shared with the applicant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/applications")}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Review</Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrantReviewForm;
