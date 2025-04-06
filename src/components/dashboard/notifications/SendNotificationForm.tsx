
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { NotificationType, Notification } from "@/types/grants";
import { ALL_GRANTS } from "@/data/mockData";

interface SendNotificationFormProps {
  onSuccess: () => void;
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ onSuccess }) => {
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<NotificationType>("status_update");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [relatedItemType, setRelatedItemType] = useState<"none" | "grant" | "report" | "opportunity" | "event">("none");
  const [relatedItemId, setRelatedItemId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dueDateValue, setDueDateValue] = useState("");

  useEffect(() => {
    // Fetch users from localStorage (in a real app, this would be an API call)
    const fetchUsers = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("au_gms_users") || "[]");
        // Only show researchers for notifications
        const researchers = storedUsers.filter((user: User) => user.role === "researcher");
        setUsers(researchers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const notifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
      
      const baseNotification: Partial<Notification> = {
        message,
        type: notificationType,
        isRead: false,
        createdAt: new Date().toISOString()
      };

      // Add related item if selected
      if (relatedItemType !== "none" && relatedItemId) {
        baseNotification.relatedType = relatedItemType;
        baseNotification.relatedId = relatedItemId;
      }

      if (recipientType === "all") {
        // Send to all researchers
        const newNotification: Notification = {
          id: Date.now().toString(),
          userId: "all",
          ...baseNotification as Omit<Notification, "id" | "userId">
        };
        
        notifications.push(newNotification);
      } else {
        // Send to specific user
        const newNotification: Notification = {
          id: Date.now().toString(),
          userId: selectedUser,
          ...baseNotification as Omit<Notification, "id" | "userId">
        };
        
        notifications.push(newNotification);
      }
      
      // Save to localStorage
      localStorage.setItem("au_gms_notifications", JSON.stringify(notifications));
      
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
              {ALL_GRANTS.map((grant) => (
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
