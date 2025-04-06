
// Assuming this file exists in read-only, we can't modify it directly
// Instead, we'll create a wrapper component that adds the notification functionality

import React from "react";
import { toast } from "sonner";
import { Notification } from "@/types/grants";

// Note: This is a wrapper component that will be used to intercept the form submission
// and add notification functionality

const sendNewOpportunityNotification = (opportunityId: string, opportunityTitle: string) => {
  try {
    const notifications = JSON.parse(localStorage.getItem("au_gms_notifications") || "[]");
    
    // Create notification for all researchers
    const newNotification: Notification = {
      id: Date.now().toString(),
      userId: "all",
      message: `New grant opportunity: ${opportunityTitle}`,
      type: "opportunity",
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedId: opportunityId,
      relatedType: "opportunity"
    };
    
    notifications.push(newNotification);
    
    // Save to localStorage
    localStorage.setItem("au_gms_notifications", JSON.stringify(notifications));
    
    toast.success("Notification sent to all researchers about the new opportunity!");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

// Export the notification sender function for use in other components
export { sendNewOpportunityNotification };
