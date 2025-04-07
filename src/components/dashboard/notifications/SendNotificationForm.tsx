
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { NotificationType } from "@/types/grants";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/integrations/supabase/typedClient";

interface SendNotificationFormProps {
  onSuccess: () => void;
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<NotificationType>("status_update");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [relatedItemType, setRelatedItemType] = useState<"none" | "grant" | "report" | "opportunity" | "event">("none");
  const [relatedItemId, setRelatedItemId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDateValue, setDueDateValue] = useState("");
  const [grants, setGrants] = useState<any[]>([]);

  useEffect(() => {
    // Fetch users and grants from Supabase
    const fetchData = async () => {
      try {
        // Fetch researchers
        const { data: profilesData, error: profilesError } = await db
          .from('profiles')
          .select('*')
          .eq('role', 'researcher');
        
        if (profilesError) throw profilesError;

        // Transform profiles to User type
        const researchers = profilesData.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as any,
          department: profile.department || undefined
        }));
        
        setUsers(researchers);

        // Fetch grants
        const { data: grantsData, error: grantsError } = await db
          .from('grants')
          .select('id, title');

        if (grantsError) throw grantsError;
        setGrants(grantsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load necessary data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to send notifications");
      }

      // Base notification data
      const notificationData: any = {
        message,
        type: notificationType,
        is_read: false
      };

      // Add related item if selected
      if (relatedItemType !== "none" && relatedItemId) {
        notificationData.related_id = relatedItemId;
        notificationData.related_type = relatedItemType;
      }

      if (recipientType === "all") {
        // Send to all researchers - insert multiple notifications
        const { error: fetchError } = await db
          .from('profiles')
          .select('id')
          .eq('role', 'researcher');

        if (fetchError) throw fetchError;

        // For each researcher, insert a notification
        for (const user of users) {
          const { error } = await db
            .from('notifications')
            .insert({
              ...notificationData,
              user_id: user.id
            });
          
          if (error) throw error;
        }
      } else {
        // Send to specific user
        const { error } = await db
          .from('notifications')
          .insert({
            ...notificationData,
            user_id: selectedUser
          });
        
        if (error) throw error;
      }
      
      toast.success("Notification sent successfully!");
      setMessage("");
      onSuccess();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Recipients</Label>
        <RadioGroup 
          value={recipientType} 
          onValueChange={setRecipientType} 
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Researchers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="specific" id="specific" />
            <Label htmlFor="specific">Specific Researcher</Label>
          </div>
        </RadioGroup>
      </div>
      
      {recipientType === "specific" && (
        <div className="space-y-2">
          <Label htmlFor="user">Select Researcher</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser} required={recipientType === "specific"}>
            <SelectTrigger>
              <SelectValue placeholder="Select a researcher" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="type">Notification Type</Label>
        <Select value={notificationType} onValueChange={(value) => setNotificationType(value as NotificationType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status_update">Status Update</SelectItem>
            <SelectItem value="due_date">Deadline Reminder</SelectItem>
            <SelectItem value="report_submission">Report Submission</SelectItem>
            <SelectItem value="opportunity">New Opportunity</SelectItem>
            <SelectItem value="grant_response">Grant Application Update</SelectItem>
            <SelectItem value="ip_update">IP Update</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {notificationType === "due_date" && (
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input 
            type="date"
            id="dueDate"
            value={dueDateValue}
            onChange={(e) => setDueDateValue(e.target.value)}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="relatedItem">Related To (Optional)</Label>
        <Select value={relatedItemType} onValueChange={(value: "none" | "grant" | "report" | "opportunity" | "event") => setRelatedItemType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select related item type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="grant">Grant</SelectItem>
            <SelectItem value="report">Report</SelectItem>
            <SelectItem value="opportunity">Opportunity</SelectItem>
            <SelectItem value="event">Calendar Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {relatedItemType === "grant" && (
        <div className="space-y-2">
          <Label htmlFor="relatedItemId">Select Grant</Label>
          <Select value={relatedItemId} onValueChange={setRelatedItemId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a grant" />
            </SelectTrigger>
            <SelectContent>
              {grants.map((grant) => (
                <SelectItem key={grant.id} value={grant.id}>
                  {grant.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Enter your notification message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSuccess}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Notification"}
        </Button>
      </div>
    </form>
  );
};

export default SendNotificationForm;
