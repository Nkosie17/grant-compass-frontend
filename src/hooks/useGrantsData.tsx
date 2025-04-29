
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Grant, GrantOpportunity } from "@/types/grants";

export function useGrantsData() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [opportunities, setOpportunities] = useState<GrantOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Fetch grants based on user role
  const fetchGrants = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let query = supabase.from('grants').select('*');
      
      // Filter by researcher if user is a researcher
      if (user.role === 'researcher') {
        query = query.eq('researcher_id', user.id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setGrants(data);
    } catch (error: any) {
      console.error("Error fetching grants:", error);
      toast.error("Failed to load grants: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch grant opportunities
  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('grant_opportunities')
        .select('*')
        .order('deadline', { ascending: true });
        
      if (error) throw error;
      
      setOpportunities(data);
    } catch (error: any) {
      console.error("Error fetching grant opportunities:", error);
      toast.error("Failed to load grant opportunities: " + error.message);
    }
  };
  
  // Submit a new grant application
  const submitGrantApplication = async (grant: Partial<Grant>) => {
    if (!user) return null;
    
    try {
      // Add researcher info and set initial status
      const grantData = {
        ...grant,
        researcher_id: user.id,
        researcher_name: user.name,
        department: user.department || "General",
        status: "submitted",
        submitted_by: user.id,
        submitted_date: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('grants')
        .insert(grantData)
        .select();
        
      if (error) throw error;
      
      toast.success("Grant application submitted successfully");
      
      // Create notification for grant office
      await createNotificationForGrantOffice(
        "New grant application submitted", 
        "grant_submission",
        data[0].id,
        "grant"
      );
      
      return data[0];
    } catch (error: any) {
      console.error("Error submitting grant application:", error);
      toast.error("Failed to submit application: " + error.message);
      return null;
    }
  };
  
  // Create a new grant opportunity (grant office only)
  const createGrantOpportunity = async (opportunity: Partial<GrantOpportunity>) => {
    if (!user || (user.role !== 'grant_office' && user.role !== 'admin')) {
      toast.error("You don't have permission to create grant opportunities");
      return null;
    }
    
    try {
      const { data, error } = await supabase
        .from('grant_opportunities')
        .insert({
          ...opportunity,
          posted_by: user.id,
          posted_date: new Date().toISOString()
        })
        .select();
        
      if (error) throw error;
      
      toast.success("Grant opportunity published successfully");
      
      // Notify all researchers about the new opportunity
      await createNotificationForAllResearchers(
        `New grant opportunity: ${opportunity.title}`,
        "new_opportunity",
        data[0].id,
        "opportunity"
      );
      
      return data[0];
    } catch (error: any) {
      console.error("Error creating grant opportunity:", error);
      toast.error("Failed to create opportunity: " + error.message);
      return null;
    }
  };
  
  // Review a grant application (grant office only)
  const reviewGrantApplication = async (grantId: string, status: string, comments: string) => {
    if (!user || (user.role !== 'grant_office' && user.role !== 'admin')) {
      toast.error("You don't have permission to review grant applications");
      return false;
    }
    
    try {
      // Get the grant to find out the researcher
      const { data: grantData, error: grantError } = await supabase
        .from('grants')
        .select('researcher_id')
        .eq('id', grantId)
        .single();
        
      if (grantError) throw grantError;
      
      // Update the grant status
      const { error } = await supabase
        .from('grants')
        .update({
          status,
          review_comments: comments,
          reviewed_by: user.id,
          reviewed_date: new Date().toISOString(),
        })
        .eq('id', grantId);
        
      if (error) throw error;
      
      // Notify the researcher
      if (grantData.researcher_id) {
        await createNotification(
          `Your grant application has been ${status === 'approved' ? 'approved' : 'rejected'}`,
          status === 'approved' ? 'grant_approval' : 'grant_rejection',
          grantData.researcher_id,
          grantId,
          "grant"
        );
      }
      
      toast.success(`Grant has been ${status}`);
      return true;
    } catch (error: any) {
      console.error("Error reviewing grant application:", error);
      toast.error("Failed to review application: " + error.message);
      return false;
    }
  };

  // Helper function to create a notification for all researchers
  const createNotificationForAllResearchers = async (message: string, type: string, relatedId?: string, relatedType?: string) => {
    try {
      // Get all researchers
      const { data: researchers, error: researchersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'researcher');
        
      if (researchersError) throw researchersError;
      
      // Create notifications for each researcher
      for (const researcher of researchers) {
        await createNotification(message, type, researcher.id, relatedId, relatedType);
      }
    } catch (error) {
      console.error("Error creating notifications for researchers:", error);
    }
  };

  // Helper function to create a notification for grant office staff
  const createNotificationForGrantOffice = async (message: string, type: string, relatedId?: string, relatedType?: string) => {
    try {
      // Get all grant office staff
      const { data: grantOfficeStaff, error: staffError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'grant_office');
        
      if (staffError) throw staffError;
      
      // Create notifications for each grant office staff member
      for (const staff of grantOfficeStaff) {
        await createNotification(message, type, staff.id, relatedId, relatedType);
      }
    } catch (error) {
      console.error("Error creating notifications for grant office:", error);
    }
  };
  
  // Create a notification for a specific user
  const createNotification = async (message: string, type: string, userId: string, relatedId?: string, relatedType?: string) => {
    try {
      await supabase.from('notifications').insert({
        user_id: userId,
        message,
        type,
        is_read: false,
        related_id: relatedId,
        related_type: relatedType,
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    if (user) {
      fetchGrants();
      fetchOpportunities();
    }
  }, [user]);
  
  return {
    grants,
    opportunities,
    loading,
    fetchGrants,
    fetchOpportunities,
    submitGrantApplication,
    createGrantOpportunity,
    reviewGrantApplication,
    createNotification,
    createNotificationForAllResearchers,
    createNotificationForGrantOffice,
  };
}
