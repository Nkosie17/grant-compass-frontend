
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { GrantCategory, FundingSource } from "@/types/grants";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

const collegeOptions = [
  "College of Business, Peace, Leadership and Governance",
  "College of Health, Agriculture and Natural Sciences",
  "College of Social Sciences, Theology, Humanities and Education",
];

const formSchema = z.object({
  title: z.string().min(5, "Study title must be at least 5 characters"),
  piName: z.string().min(2, "Principal Investigator name is required"),
  collegeName: z.string().min(2, "College name is required"),
  yearOfApplication: z.string().min(4, "Year of application is required"),
  statementOfPurpose: z.string().max(200, "Statement of purpose should be limited to 2 sentences"),
  background: z.string().max(5000, "Background should be limited to approximately 500 words"),
  broadObjective: z.string().max(200, "Broad objective should be limited to 2 sentences"),
  specificObjectives: z.array(
    z.object({
      objective: z.string().min(1, "Specific objective is required")
    })
  ).min(1, "At least one specific objective is required"),
  literatureReview: z.string().max(7500, "Literature review should be limited to approximately 750 words"),
  activities: z.array(
    z.object({
      milestoneNumber: z.string().min(1, "Milestone number is required"),
      activityDescription: z.string().min(1, "Activity description is required"),
      milestoneDeliverable: z.string().min(1, "Milestone deliverable is required"),
      estimatedTime: z.string().min(1, "Estimated time is required"),
      technicalApproval: z.boolean().optional(),
      paymentAmount: z.string().min(1, "Payment amount is required")
    })
  ).min(1, "At least one activity is required"),
  expectedOutcomes: z.array(
    z.object({
      outcome: z.string().min(1, "Expected outcome is required")
    })
  ).min(1, "At least one expected outcome is required"),
  monitoringEvaluation: z.string().min(1, "Monitoring and evaluation plan is required"),
  indicators: z.array(
    z.object({
      indicator: z.string().min(1, "Indicator is required")
    })
  ).optional(),
  budgetItems: z.array(
    z.object({
      budgetNumber: z.string().min(1, "Budget number is required"),
      activity: z.string().min(1, "Activity is required"),
      duration: z.string().min(1, "Duration is required"),
      responsibility: z.string().min(1, "Responsibility is required"),
      quantity: z.string().min(1, "Quantity is required"),
      frequency: z.string().min(1, "Frequency is required"),
      unitCost: z.string().min(1, "Unit cost is required"),
      unitType: z.string().min(1, "Unit type is required"),
      budgetNotes: z.string().optional()
    })
  ).min(1, "At least one budget item is required"),
  studentParticipation: z.array(
    z.object({
      college: z.string().min(1, "College is required"),
      department: z.string().min(1, "Department is required"),
      studentName: z.string().min(1, "Student name is required"),
      role: z.string().min(1, "Role in project is required"),
      studentNumber: z.string().min(1, "Student number is required"),
      programme: z.string().min(1, "Programme is required")
    })
  ).optional(),
  workPlan: z.array(
    z.object({
      activity: z.string().min(1, "Activity is required"),
      months: z.array(z.boolean()).length(12, "All 12 months must be specified")
    })
  ).min(1, "At least one work plan item is required"),
  references: z.array(
    z.object({
      reference: z.string().min(1, "Reference is required")
    })
  ).min(1, "At least one reference is required"),
  category: z.enum(["research", "education", "community", "infrastructure", "innovation"] as const),
  fundingSource: z.enum(["internal", "external"] as const),
});

type FormValues = z.infer<typeof formSchema>;

const GrantApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      piName: user?.name || "",
      collegeName: "",
      yearOfApplication: currentYear.toString(),
      statementOfPurpose: "",
      background: "",
      broadObjective: "",
      specificObjectives: [{ objective: "" }],
      literatureReview: "",
      activities: [{ milestoneNumber: "1", activityDescription: "", milestoneDeliverable: "", estimatedTime: "", technicalApproval: false, paymentAmount: "" }],
      expectedOutcomes: [{ outcome: "" }],
      monitoringEvaluation: "",
      indicators: [{ indicator: "" }],
      budgetItems: [{ budgetNumber: "1", activity: "", duration: "", responsibility: "", quantity: "", frequency: "", unitCost: "", unitType: "", budgetNotes: "" }],
      studentParticipation: [{ college: "", department: "", studentName: "", role: "", studentNumber: "", programme: "" }],
      workPlan: [{ activity: "", months: Array(12).fill(false) }],
      references: [{ reference: "" }],
      category: "research",
      fundingSource: "internal",
    },
  });

  const { fields: specificObjectivesFields, append: appendSpecificObjective, remove: removeSpecificObjective } = useFieldArray({
    control: form.control,
    name: "specificObjectives",
  });

  const { fields: activitiesFields, append: appendActivity, remove: removeActivity } = useFieldArray({
    control: form.control,
    name: "activities",
  });

  const { fields: expectedOutcomesFields, append: appendExpectedOutcome, remove: removeExpectedOutcome } = useFieldArray({
    control: form.control,
    name: "expectedOutcomes",
  });

  const { fields: indicatorsFields, append: appendIndicator, remove: removeIndicator } = useFieldArray({
    control: form.control,
    name: "indicators",
  });

  const { fields: budgetItemsFields, append: appendBudgetItem, remove: removeBudgetItem } = useFieldArray({
    control: form.control,
    name: "budgetItems",
  });

  const { fields: studentParticipationFields, append: appendStudentParticipation, remove: removeStudentParticipation } = useFieldArray({
    control: form.control,
    name: "studentParticipation",
  });

  const { fields: workPlanFields, append: appendWorkPlan, remove: removeWorkPlan } = useFieldArray({
    control: form.control,
    name: "workPlan",
  });

  const { fields: referencesFields, append: appendReference, remove: removeReference } = useFieldArray({
    control: form.control,
    name: "references",
  });

  const moveToNextTab = () => {
    switch (activeTab) {
      case "basic":
        setActiveTab("objectives");
        break;
      case "objectives":
        setActiveTab("literature");
        break;
      case "literature":
        setActiveTab("activities");
        break;
      case "activities":
        setActiveTab("outcomes");
        break;
      case "outcomes":
        setActiveTab("budget");
        break;
      case "budget":
        setActiveTab("students");
        break;
      case "students":
        setActiveTab("workplan");
        break;
      case "workplan":
        setActiveTab("references");
        break;
      default:
        break;
    }
  };

  const moveToPreviousTab = () => {
    switch (activeTab) {
      case "objectives":
        setActiveTab("basic");
        break;
      case "literature":
        setActiveTab("objectives");
        break;
      case "activities":
        setActiveTab("literature");
        break;
      case "outcomes":
        setActiveTab("activities");
        break;
      case "budget":
        setActiveTab("outcomes");
        break;
      case "students":
        setActiveTab("budget");
        break;
      case "workplan":
        setActiveTab("students");
        break;
      case "references":
        setActiveTab("workplan");
        break;
      default:
        break;
    }
  };

  const calculateProgress = () => {
    const totalSteps = 8;
    const currentStep = ["basic", "objectives", "literature", "activities", "outcomes", "budget", "students", "workplan", "references"].indexOf(activeTab) + 1;
    return (currentStep / totalSteps) * 100;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Generate a unique ID for the grant
      const grantId = `grant_${Date.now().toString()}`;

      // Create the grant object
      const grant = {
        id: grantId,
        title: data.title,
        piName: data.piName,
        collegeName: data.collegeName,
        yearOfApplication: data.yearOfApplication,
        statementOfPurpose: data.statementOfPurpose,
        background: data.background,
        broadObjective: data.broadObjective,
        specificObjectives: data.specificObjectives,
        literatureReview: data.literatureReview,
        activities: data.activities,
        expectedOutcomes: data.expectedOutcomes,
        monitoringEvaluation: data.monitoringEvaluation,
        indicators: data.indicators || [],
        budgetItems: data.budgetItems,
        studentParticipation: data.studentParticipation || [],
        workPlan: data.workPlan,
        references: data.references,
        status: "submitted" as const,
        category: data.category as GrantCategory,
        fundingSource: data.fundingSource as FundingSource,
        submittedBy: user?.id,
        researcherId: user?.id,
        researcherName: user?.name,
        department: user?.department,
        submittedDate: new Date().toISOString(),
      };

      // In a real app, this would be an API call to save the grant
      console.log("Submitting application:", grant);

      // Simulate an API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store in localStorage for demo purposes
      const existingGrants = JSON.parse(localStorage.getItem("au_gms_grants") || "[]");
      localStorage.setItem("au_gms_grants", JSON.stringify([...existingGrants, grant]));

      toast.success("Application submitted successfully");
      navigate("/my-grants");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AU Grant Application Form</CardTitle>
          <CardDescription>Complete all sections to submit your grant application</CardDescription>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div 
              className="bg-[#cf2e2e] h-2.5 rounded-full"
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-6">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="objectives">Objectives</TabsTrigger>
                  <TabsTrigger value="literature">Literature</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="workplan">Work Plan</TabsTrigger>
                  <TabsTrigger value="references">References</TabsTrigger>
                </TabsList>

                {/* Basic Information */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Study Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the title of your research project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="piName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal Investigator (PI) Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter PI name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="collegeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>College Name</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select college" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {collegeOptions.map((college) => (
                                <SelectItem key={college} value={college}>
                                  {college}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearOfApplication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year of Application</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grant Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                          <FormLabel>Funding Source</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select funding source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="internal">Internal</SelectItem>
                              <SelectItem value="external">External</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="statementOfPurpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statement of Purpose (2 sentences max)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief statement of purpose"
                            className="h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Limited to 2 sentences, approximately 200 characters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="background"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background (1 page max)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Project background"
                            className="h-40"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Limited to approximately 500 words
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Objectives */}
                <TabsContent value="objectives" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="broadObjective"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Broad Objective (2 sentences max)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Overall project objective"
                            className="h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Limited to 2 sentences
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Specific Objectives</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendSpecificObjective({ objective: "" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Objective
                      </Button>
                    </div>

                    {specificObjectivesFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`specificObjectives.${index}.objective`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex gap-2 items-center">
                                    <span className="text-sm font-medium">{index + 1}.</span>
                                    <Input placeholder="Specific objective" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (specificObjectivesFields.length > 1) {
                              removeSpecificObjective(index);
                            }
                          }}
                          className="mt-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <FormDescription>
                      Each specific objective should map to a project deliverable
                    </FormDescription>
                  </div>
                </TabsContent>

                {/* Literature Review */}
                <TabsContent value="literature" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="literatureReview"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Literature Review (1.5 pages max)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Literature review in APA format"
                            className="h-64"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Limited to approximately 750 words. Include citations in APA format.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Activities and Timeline */}
                <TabsContent value="activities" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Activities and Timeline</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendActivity({ 
                          milestoneNumber: (activitiesFields.length + 1).toString(),
                          activityDescription: "",
                          milestoneDeliverable: "",
                          estimatedTime: "",
                          technicalApproval: false,
                          paymentAmount: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Activity
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[80px]">Milestone #</TableHead>
                            <TableHead className="w-[250px]">Activity Description</TableHead>
                            <TableHead className="w-[200px]">Milestone Deliverable</TableHead>
                            <TableHead className="w-[150px]">Est. Time</TableHead>
                            <TableHead className="w-[120px]">Tech Approval</TableHead>
                            <TableHead className="w-[120px]">Payment ($)</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activitiesFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.milestoneNumber`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.activityDescription`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="Description" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.milestoneDeliverable`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="Deliverable" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.estimatedTime`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="Time" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.technicalApproval`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Checkbox 
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`activities.${index}.paymentAmount`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="0.00" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (activitiesFields.length > 1) {
                                      removeActivity(index);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                {/* Expected Outcomes & M&E Plan */}
                <TabsContent value="outcomes" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Expected Outcomes</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendExpectedOutcome({ outcome: "" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Outcome
                      </Button>
                    </div>

                    {expectedOutcomesFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`expectedOutcomes.${index}.outcome`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex gap-2 items-center">
                                    <span className="text-sm font-medium">{index + 1}.</span>
                                    <Input placeholder="Expected outcome" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (expectedOutcomesFields.length > 1) {
                              removeExpectedOutcome(index);
                            }
                          }}
                          className="mt-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <FormField
                    control={form.control}
                    name="monitoringEvaluation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monitoring and Evaluation (M&E) Plan</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your M&E plan"
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Indicators (Optional)</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendIndicator({ indicator: "" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Indicator
                      </Button>
                    </div>

                    {indicatorsFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`indicators.${index}.indicator`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex gap-2 items-center">
                                    <span className="text-sm font-medium">{index + 1}.</span>
                                    <Input placeholder="Indicator" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIndicator(index)}
                          className="mt-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Budget - Restructured to make input areas more visible */}
                <TabsContent value="budget" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Detailed Budget</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendBudgetItem({
                          budgetNumber: (budgetItemsFields.length + 1).toString(),
                          activity: "",
                          duration: "",
                          responsibility: "",
                          quantity: "",
                          frequency: "",
                          unitCost: "",
                          unitType: "",
                          budgetNotes: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Budget Item
                      </Button>
                    </div>

                    {budgetItemsFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Budget Item #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (budgetItemsFields.length > 1) {
                                removeBudgetItem(index);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.activity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Activity</FormLabel>
                                <FormControl>
                                  <Input placeholder="Activity" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.duration`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                  <Input placeholder="Duration" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.responsibility`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Responsibility</FormLabel>
                                <FormControl>
                                  <Input placeholder="Responsibility" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input placeholder="Quantity" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.frequency`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Frequency</FormLabel>
                                <FormControl>
                                  <Input placeholder="Frequency" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.unitCost`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit Cost</FormLabel>
                                <FormControl>
                                  <Input placeholder="Unit Cost" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.unitType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit Type</FormLabel>
                                <FormControl>
                                  <Input placeholder="Unit Type" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`budgetItems.${index}.budgetNotes`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Budget notes" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Student Participation - Restructured for better visibility */}
                <TabsContent value="students" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Student Participation</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendStudentParticipation({ 
                          college: "",
                          department: "",
                          studentName: "",
                          role: "",
                          studentNumber: "",
                          programme: ""
                        })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Student
                      </Button>
                    </div>

                    {studentParticipationFields.map((field, index) => (
                      <Card key={field.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">Student #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStudentParticipation(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.studentName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Student Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.studentNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Student Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Student Number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.role`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role in Project</FormLabel>
                                <FormControl>
                                  <Input placeholder="Role" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.college`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>College</FormLabel>
                                <FormControl>
                                  <Input placeholder="College" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.department`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input placeholder="Department" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`studentParticipation.${index}.programme`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Programme</FormLabel>
                                <FormControl>
                                  <Input placeholder="Programme" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Work Plan */}
                <TabsContent value="workplan" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">Work Plan</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendWorkPlan({ activity: "", months: Array(12).fill(false) })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Work Plan Item
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[250px]">Activity</TableHead>
                            <TableHead>Jan</TableHead>
                            <TableHead>Feb</TableHead>
                            <TableHead>Mar</TableHead>
                            <TableHead>Apr</TableHead>
                            <TableHead>May</TableHead>
                            <TableHead>Jun</TableHead>
                            <TableHead>Jul</TableHead>
                            <TableHead>Aug</TableHead>
                            <TableHead>Sep</TableHead>
                            <TableHead>Oct</TableHead>
                            <TableHead>Nov</TableHead>
                            <TableHead>Dec</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workPlanFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <FormField
                                  control={form.control}
                                  name={`workPlan.${index}.activity`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormControl>
                                        <Input placeholder="Activity" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </TableCell>
                              {Array(12).fill(0).map((_, monthIndex) => (
                                <TableCell key={monthIndex} className="text-center">
                                  <FormField
                                    control={form.control}
                                    name={`workPlan.${index}.months.${monthIndex}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </TableCell>
                              ))}
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (workPlanFields.length > 1) {
                                      removeWorkPlan(index);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                {/* References */}
                <TabsContent value="references" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-base">References</FormLabel>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendReference({ reference: "" })}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Reference
                      </Button>
                    </div>

                    {referencesFields.map((field, index) => (
                      <div key={field.id} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name={`references.${index}.reference`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex gap-2 items-center">
                                    <span className="text-sm font-medium">{index + 1}.</span>
                                    <Input placeholder="APA format reference" {...field} />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (referencesFields.length > 1) {
                              removeReference(index);
                            }
                          }}
                          className="mt-1"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={moveToPreviousTab}
                  disabled={activeTab === "basic"}
                >
                  Previous Section
                </Button>
                {activeTab !== "references" ? (
                  <Button
                    type="button"
                    onClick={moveToNextTab}
                  >
                    Next Section
                  </Button>
                ) : (
                  <Button type="submit" className="bg-[#cf2e2e] hover:bg-[#9e2121]">
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrantApplicationForm;
