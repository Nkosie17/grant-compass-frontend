import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/contexts/auth/useAuth";
import { useGrantsData } from "@/hooks/useGrantsData";
import { toast } from "sonner";
import { FundingSource, GrantCategory } from "@/types/grants";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string(),
  fundingSource: z.string(),
  amount: z.coerce.number().positive({ message: "Amount must be positive" }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  studentParticipation: z.boolean().default(false),
  workPlan: z.string().min(50, { message: "Work plan must be at least 50 characters" }).optional(),
  
  // Budget items
  facultySalary: z.coerce.number().min(0).default(0),
  staffSalary: z.coerce.number().min(0).default(0),
  studentStipends: z.coerce.number().min(0).default(0),
  equipment: z.coerce.number().min(0).default(0),
  supplies: z.coerce.number().min(0).default(0),
  travel: z.coerce.number().min(0).default(0),
  other: z.coerce.number().min(0).default(0),
});

const GrantApplicationForm = () => {
  const { user } = useAuth();
  const { submitGrantApplication } = useGrantsData();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "research",
      fundingSource: "internal",
      amount: 0,
      studentParticipation: false,
      facultySalary: 0,
      staffSalary: 0,
      studentStipends: 0,
      equipment: 0,
      supplies: 0,
      travel: 0,
      other: 0,
      workPlan: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error("You must be logged in to submit a grant application");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare budget object
      const budget = {
        facultySalary: values.facultySalary,
        staffSalary: values.staffSalary,
        studentStipends: values.studentStipends,
        equipment: values.equipment,
        supplies: values.supplies,
        travel: values.travel,
        other: values.other
      };
      
      // Calculate total amount based on budget items
      const totalBudget = Object.values(budget).reduce((sum, value) => sum + value, 0);
      
      // Check if manual amount matches budget
      if (values.amount !== totalBudget) {
        if (!confirm(`Your entered amount ($${values.amount}) doesn't match the total budget ($${totalBudget}). Do you want to continue with the entered amount?`)) {
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare activities array
      const activities = ["Research", "Development", "Publication"];
      
      // Submit application
      const result = await submitGrantApplication({
        title: values.title,
        description: values.description,
        category: values.category as GrantCategory,
        fundingSource: values.fundingSource as FundingSource,
        amount: values.amount,
        startDate: values.startDate ? values.startDate.toISOString() : undefined,
        endDate: values.endDate ? values.endDate.toISOString() : undefined,
        activities: activities,
        budget: budget,
        student_participation: values.studentParticipation,
        work_plan: values.workPlan,
      });
      
      if (result) {
        toast.success("Grant application submitted successfully");
        navigate("/applications");
      }
    } catch (error: any) {
      console.error("Error submitting grant application:", error);
      toast.error("Failed to submit application: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate total budget
  const totalBudget = () => {
    const values = form.getValues();
    return (
      values.facultySalary +
      values.staffSalary +
      values.studentStipends +
      values.equipment +
      values.supplies +
      values.travel +
      values.other
    );
  };
  
  // Auto-update amount when budget changes
  React.useEffect(() => {
    const subscription = form.watch(() => {
      form.setValue("amount", totalBudget());
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Grant Application</CardTitle>
          <CardDescription>
            Submit a new grant application. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Grant title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
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
                    control={form.control}
                    name="fundingSource"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Source *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select funding source" />
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
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your grant proposal"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="workPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Plan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your work plan and timeline"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Student Participation - Horizontal Layout */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Student Participation</h3>
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="studentParticipation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                          <div className="space-y-0.5">
                            <FormLabel>Will students participate in this grant?</FormLabel>
                            <FormDescription>
                              Toggle if undergraduate or graduate students will be involved in this project.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Detailed Budget - Horizontal Layout */}
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Detailed Budget</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facultySalary"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Faculty Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="staffSalary"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Staff Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="studentStipends"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Student Stipends</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="equipment"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Equipment</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="supplies"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Supplies</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="travel"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Travel</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="other"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-3 shadow-sm">
                          <FormLabel>Other Expenses</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              className="w-[120px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center bg-muted p-3 rounded-lg">
                    <span className="font-medium">Total Budget:</span>
                    <span className="font-bold">${totalBudget().toLocaleString()}</span>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount ($) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrantApplicationForm;
