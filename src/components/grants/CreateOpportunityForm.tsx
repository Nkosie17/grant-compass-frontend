
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

// Simple placeholder component that will be replaced with the actual form implementation
const CreateOpportunityForm = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Opportunity</h1>
      <p className="text-gray-600 mb-4">
        This form allows grant office staff to create new funding opportunities for researchers.
        <br />
        When published, notifications will automatically be sent to all researchers.
      </p>
      {/* The actual form implementation would go here */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-yellow-700">
          This is a placeholder component. The actual implementation would include a form to create new opportunities.
        </p>
      </div>
    </div>
  );
};

// Export the notification sender function for use in other components
export { sendNewOpportunityNotification };

// Add default export for the component
export default CreateOpportunityForm;
