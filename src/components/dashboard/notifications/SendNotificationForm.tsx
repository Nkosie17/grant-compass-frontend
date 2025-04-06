
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { Notification } from "@/types/grants";

interface SendNotificationFormProps {
  onSuccess: () => void;
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ onSuccess }) => {
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState<Notification["type"]>("status_update");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUser, setSelectedUser] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      
      if (recipientType === "all") {
        // Send to all researchers
        const newNotification: Notification = {
          id: Date.now().toString(),
          userId: "all",
          message,
          type: notificationType,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        
        notifications.push(newNotification);
      } else {
        // Send to specific user
        const newNotification: Notification = {
          id: Date.now().toString(),
          userId: selectedUser,
          message,
          type: notificationType,
          isRead: false,
          createdAt: new Date().toISOString()
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
        <Select value={notificationType} onValueChange={(value: any) => setNotificationType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="status_update">Status Update</SelectItem>
            <SelectItem value="due_date">Deadline Reminder</SelectItem>
            <SelectItem value="report_submission">Report Submission</SelectItem>
            <SelectItem value="opportunity">New Opportunity</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
