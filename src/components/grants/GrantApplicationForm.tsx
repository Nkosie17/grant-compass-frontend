import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  amount: z.coerce
    .number()
    .min(1, { message: "Amount must be greater than 0." }),
  category: z.enum(["research", "education", "community", "infrastructure", "innovation"]),
  fundingSource: z.enum(["internal", "external", "government", "private", "foundation"]),
  startDate: z.string(),
  endDate: z.string(),
  activities: z.string().min(10, {
    message: "Activities must be at least 10 characters.",
  }),
  budget: z.string().min(10, {
    message: "Budget must be at least 10 characters.",
  }),
  studentParticipation: z.string().min(10, {
    message: "Student participation must be at least 10 characters.",
  }),
  workPlan: z.string().min(10, {
    message: "Work plan must be at least 10 characters.",
  }),
});

const GrantApplicationForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      category: "research",
      fundingSource: "internal",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      activities: "",
      budget: "",
      studentParticipation: "",
      workPlan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get existing grants from localStorage or initialize an empty array
      const existingGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");

      // Create a new grant object
      const newGrant = {
        id: `grant_${Date.now().toString()}`,
        ...values,
        status: "submitted",
        submittedBy: user?.id,
        submittedDate: new Date().toISOString(),
        researcherId: user?.id,
        researcherName: user?.name,
        department: user?.department,
      };

      // Add the new grant to the existing grants array
      const updatedGrants = [...existingGrants, newGrant];

      // Save the updated grants array back to localStorage
      localStorage.setItem("au_gms_grants", JSON.stringify(updatedGrants));

      toast.success("Grant application submitted successfully!");
      navigate("/applications");
    } catch (error) {
      toast.error("Failed to submit grant application.");
    }
  };

  const { control, handleSubmit } = form;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Grant Application</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Grant Title" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Amount Requested" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="innovation">Innovation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="fundingSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Source</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Select a funding source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="external">External</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="foundation">Foundation</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" className="text-base" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the grant"
                    className="min-h-24 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Activities</h2>
          <div className="space-y-4">
            <FormField
              control={control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Planned Activities</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the activities that will be carried out as part of this grant" 
                      className="min-h-32 text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Budget</h2>
          <div className="space-y-4">
            <FormField
              control={control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Breakdown</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide a detailed breakdown of how the funds will be used" 
                      className="min-h-32 text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Student Participation</h2>
          <div className="space-y-4">
            <FormField
              control={control}
              name="studentParticipation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Involvement</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe how students will be involved in this project" 
                      className="min-h-32 text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Work Plan</h2>
          <div className="space-y-4">
            <FormField
              control={control}
              name="workPlan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Timeline and Milestones</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Outline the timeline and key milestones for your project" 
                      className="min-h-32 text-base" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">Submit Application</Button>
        </div>
      </form>
    </div>
  );
};

export default GrantApplicationForm;
