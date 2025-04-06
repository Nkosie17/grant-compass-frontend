
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  date: z.date({ required_error: "Event date is required" }),
  time: z.string().min(1, "Time is required"),
  type: z.string().min(1, "Event type is required"),
  isPublic: z.boolean().default(false),
  selectedResearchers: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEventFormProps {
  onSuccess: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [researchers, setResearchers] = useState<Array<{id: string, name: string}>>([
    { id: "1", name: "John Researcher" },
    { id: "3", name: "Emma Scientist" },
    { id: "4", name: "Michael Analyst" },
    { id: "5", name: "Sarah Professor" },
  ]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      time: "09:00",
      type: "deadline",
      isPublic: false,
      selectedResearchers: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Create event object
      const eventId = `event_${Date.now()}`;
      const eventDateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      eventDateTime.setHours(hours, minutes);
      
      const event = {
        id: eventId,
        title: data.title,
        description: data.description,
        date: format(data.date, "yyyy-MM-dd"),
        time: data.time,
        type: data.type,
        createdBy: user?.id,
        createdByName: user?.name,
        isPublic: data.isPublic,
        visibleTo: data.isPublic ? "all" : data.selectedResearchers || [],
      };

      // In a real app, this would be an API call
      console.log("Creating calendar event:", event);
      
      // Get existing events from localStorage
      const existingEvents = JSON.parse(localStorage.getItem("au_gms_events") || "[]");
      localStorage.setItem("au_gms_events", JSON.stringify([...existingEvents, event]));
      
      // Create notifications for researchers
      if (data.isPublic) {
        // Create notification for all researchers
        createNotification({
          message: `New event: ${data.title}`,
          type: "due_date",
          userId: "all",
        });
      } else if (data.selectedResearchers?.length) {
        // Create notifications only for selected researchers
        data.selectedResearchers.forEach(researcherId => {
          createNotification({
            message: `New event: ${data.title}`,
            type: "due_date",
            userId: researcherId,
          });
        });
      }
      
      toast.success("Event created successfully");
      onSuccess();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    }
  };

  const createNotification = ({ message, type, userId }: { message: string, type: string, userId: string }) => {
    const notificationId = `notification_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const notification = {
      id: notificationId,
      userId: userId,
      message: message,
      type: type,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    // In a real app, this would be an API call
    const existingNotifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
    localStorage.setItem("au_gms_notifications", JSON.stringify([...existingNotifications, notification]));
  };
  
  const eventTypes = [
    { value: "deadline", label: "Deadline" },
    { value: "meeting", label: "Meeting" },
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Conference" },
  ];

  const isSelectAllResearchers = form.watch("selectedResearchers")?.length === researchers.length;
  
  const handleSelectAllResearchers = (checked: boolean) => {
    if (checked) {
      form.setValue("selectedResearchers", researchers.map(r => r.id));
    } else {
      form.setValue("selectedResearchers", []);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter event title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter event description" 
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
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
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="" disabled>Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Public Event</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Make this event visible to all researchers
                </p>
              </div>
            </FormItem>
          )}
        />
        
        {!form.watch("isPublic") && (
          <FormField
            control={form.control}
            name="selectedResearchers"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>Select Researchers</FormLabel>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="select-all"
                      checked={isSelectAllResearchers}
                      onCheckedChange={handleSelectAllResearchers}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Select All
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-md p-4">
                  {researchers.map((researcher) => (
                    <FormField
                      key={researcher.id}
                      control={form.control}
                      name="selectedResearchers"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={researcher.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(researcher.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, researcher.id])
                                    : field.onChange(
                                        currentValue.filter((value) => value !== researcher.id)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {researcher.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateEventForm;
